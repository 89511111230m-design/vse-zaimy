import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

type SyncMetadataSummary = {
  found: number;
  updated: number;
  skipped: number;
  notFound: number;
  details: Array<{
    company: string;
    status: "found" | "updated" | "skipped" | "not-found";
    updatedFields?: string[];
  }>;
};

const VSEZAIMYONLINE_URL = "https://vsezaimyonline.ru/";
const DETAIL_PAGE_DELAY_MS = 250;

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase("ru-RU");
}

function compactKey(value: string) {
  return normalizeText(value).replace(/[\s-]+/g, "");
}

/** Keeps only Latin letters/digits, so it only ever matches Latin-named brands against their URL slug (e.g. "MoneyMan" vs "/moneyman"). Cyrillic names naturally reduce to an empty string and are skipped. */
function slugKey(value: string) {
  return value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "");
}

function decodeHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/\s+/g, " ")
    .trim();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseInteger(value: string) {
  const digits = value.match(/\d[\d\s]*/g)?.join("")?.replace(/\s/g, "");
  if (!digits) return null;
  const parsed = Number.parseInt(digits, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseAmountField(value: string) {
  const normalized = value.toLocaleLowerCase("ru-RU");
  const amount: { min?: number; max?: number } = {};

  if (/до/.test(normalized)) {
    const max = parseInteger(normalized.replace(/до/gi, ""));
    if (max != null) amount.max = max;
  }
  if (/от/.test(normalized)) {
    const min = parseInteger(normalized.replace(/.*от/gi, ""));
    if (min != null) amount.min = min;
  }

  return amount;
}

function parseTermField(value: string) {
  const normalized = value.toLocaleLowerCase("ru-RU");
  const term: { min?: number; max?: number } = {};

  if (/до/.test(normalized)) {
    const max = parseInteger(normalized.replace(/до/gi, ""));
    if (max != null) term.max = max;
  }
  if (/от/.test(normalized)) {
    const min = parseInteger(normalized.replace(/.*от/gi, ""));
    if (min != null) term.min = min;
  }

  return term;
}

function parseAgeField(value: string) {
  const normalized = value.toLocaleLowerCase("ru-RU");
  const age: { min?: number; max?: number } = {};
  const matches = normalized.match(/от\s*(\d+)/i);
  if (matches) {
    const minAge = parseInteger(matches[1]);
    if (minAge != null) age.min = minAge;
  }
  const maxMatch = normalized.match(/до\s*(\d+)/i);
  if (maxMatch) {
    const maxAge = parseInteger(maxMatch[1]);
    if (maxAge != null) age.max = maxAge;
  }
  return age;
}

/**
 * Unlike parseAmountField/parseTermField above (which only ever see a
 * one-sided "до X" value on the homepage listing cards), the per-company
 * detail page renders a combined "от X до Y" range in a single cell. Both
 * bounds have to be captured independently via lookahead so the digit
 * groups from either side never get concatenated together.
 */
function parseCombinedRange(value: string) {
  const range: { min?: number; max?: number } = {};

  const minMatch = value.match(/от\s*([\d\s]+?)(?=\s*(?:до|[₽%]|дн|лет|год|мин|час|$))/iu);
  if (minMatch) {
    const min = parseInteger(minMatch[1]);
    if (min != null) range.min = min;
  }

  const maxMatch = value.match(/до\s*([\d\s]+?)(?=\s*(?:[₽%]|дн|лет|год|мин|час|$))/iu);
  if (maxMatch) {
    const max = parseInteger(maxMatch[1]);
    if (max != null) range.max = max;
  }

  return range;
}

function parseOfferCardFields(cardHtml: string) {
  const metadata: {
    amountMax?: number;
    amountMin?: number;
    termMax?: number;
    termMin?: number;
    interestFreeTerm?: string;
    rate?: string;
    decisionTime?: string;
    minAge?: number;
    maxAge?: number;
    issueMethod?: string;
    additionalFeatures?: string[];
  } = {
    additionalFeatures: [],
  };

  const labelValueRegex = /<div[^>]*class=["']card-min-label-title["'][^>]*>([\s\S]*?)<\/div>[\s\S]*?<div[^>]*class=["']card-min-label[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
  let match: RegExpExecArray | null;

  while ((match = labelValueRegex.exec(cardHtml))) {
    const rawLabel = decodeHtml(match[1]);
    const rawValue = decodeHtml(match[2]);
    const label = normalizeText(rawLabel);
    const value = rawValue.trim();

    if (!value) continue;

    if (label.includes("сумма")) {
      const amount = parseAmountField(value);
      if (amount.max != null && metadata.amountMax == null) metadata.amountMax = amount.max;
      if (amount.min != null && metadata.amountMin == null) metadata.amountMin = amount.min;
      continue;
    }

    if (label.includes("срок") && label.includes("без")) {
      metadata.interestFreeTerm = value;
      continue;
    }

    if (label === "срок" || label.includes("срок") && !label.includes("без")) {
      const term = parseTermField(value);
      if (term.max != null && metadata.termMax == null) metadata.termMax = term.max;
      if (term.min != null && metadata.termMin == null) metadata.termMin = term.min;
      continue;
    }

    if (label.includes("решение") || label.includes("принятие")) {
      metadata.decisionTime = value;
      continue;
    }

    if (label.includes("ставка")) {
      metadata.rate = value;
      continue;
    }

    if (label.includes("возраст")) {
      const age = parseAgeField(value);
      if (age.min != null && metadata.minAge == null) metadata.minAge = age.min;
      if (age.max != null && metadata.maxAge == null) metadata.maxAge = age.max;
      continue;
    }

    if (label.includes("на карту") || label.includes("онлайн") || label.includes("способ") || label.includes("выдача") || label.includes("получение")) {
      metadata.issueMethod = value;
      continue;
    }

    if (label !== "рейтинг" && label !== "отзывы" && !label.includes("рейтинг") && !label.includes("отзыв")) {
      metadata.additionalFeatures?.push(`${rawLabel}: ${value}`);
    }
  }

  if (metadata.additionalFeatures?.length === 0) {
    metadata.additionalFeatures = undefined;
  }

  return metadata;
}

type CompanyCard = { cardHtml: string; href: string | null };
type CompanyCardIndex = {
  byName: Map<string, CompanyCard>;
  byCompact: Map<string, CompanyCard>;
  byHrefSlug: Map<string, CompanyCard>;
};

function buildCompanyCardMap(html: string): CompanyCardIndex {
  const byName = new Map<string, CompanyCard>();
  const byCompact = new Map<string, CompanyCard>();
  const byHrefSlug = new Map<string, CompanyCard>();
  const cardChunks = html.split(/<div\s+class=["']card-minimal\s+card[^"']*["'][^>]*>/gi).slice(1);

  for (const chunk of cardChunks) {
    const cardHtml = `<div class="card-minimal card">${chunk}`;
    const companyMatch = /<a[^>]*class=["']bank-name["'][^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i.exec(cardHtml);
    if (!companyMatch) continue;
    const href = companyMatch[1];
    const company = decodeHtml(companyMatch[2]);
    const card: CompanyCard = { cardHtml, href };

    if (!byName.has(normalizeText(company))) byName.set(normalizeText(company), card);
    if (!byCompact.has(compactKey(company))) byCompact.set(compactKey(company), card);

    const slug = slugKey(href.replace(/^\//, ""));
    if (slug && !byHrefSlug.has(slug)) byHrefSlug.set(slug, card);
  }

  return { byName, byCompact, byHrefSlug };
}

function findCompanyCard(company: string, index: CompanyCardIndex) {
  const normalizedCompany = normalizeText(company);
  if (index.byName.has(normalizedCompany)) return index.byName.get(normalizedCompany) ?? null;

  const compact = compactKey(company);
  if (index.byCompact.has(compact)) return index.byCompact.get(compact) ?? null;

  for (const [key, card] of index.byName.entries()) {
    if (key.includes(normalizedCompany) || normalizedCompany.includes(key)) {
      return card;
    }
  }

  const slug = slugKey(company);
  if (slug && index.byHrefSlug.has(slug)) return index.byHrefSlug.get(slug) ?? null;

  return null;
}

/**
 * Companies participating in the "0%" first-loan promo are rendered a second
 * time in a dedicated homepage section, with a "bank-product-name" badge
 * (e.g. "Для новых клиентов") right after their name. This scans the raw
 * homepage HTML directly, since that badge never appears on the main card.
 */
function findFirstLoanBadge(company: string, html: string) {
  const escaped = company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<a[^>]*class=["']bank-name["'][^>]*>${escaped}<\\/a>[\\s\\S]{0,400}?<a[^>]*class=["']bank-product-name["'][^>]*>([^<]+)<\\/a>`,
    "iu"
  );
  const match = html.match(pattern);
  return match ? decodeHtml(match[1]) : null;
}

/**
 * Parses the "organization-info-item" rows rendered on a company's own
 * detail page (e.g. /zaymer). Each row is a <tr> with a title cell and a
 * value cell; returns a lookup keyed by the lowercased, trimmed title.
 */
function parseOrganizationTable(html: string) {
  const rows = new Map<string, string>();
  const rowRegex = /<tr[^>]*class=["']organization-info-item["'][^>]*>\s*<td[^>]*class=["']organization-item-title["'][^>]*>([\s\S]*?)<\/td>\s*<td[^>]*class=["']organization-item-value["'][^>]*>([\s\S]*?)<\/td>\s*<\/tr>/giu;
  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(html))) {
    const title = normalizeText(decodeHtml(match[1]));
    const value = decodeHtml(match[2]);
    if (title && value && !rows.has(title)) rows.set(title, value);
  }

  return rows;
}

function parseAdvantages(html: string) {
  const section = html.match(/<span[^>]*class=["']accordion-title["'][^>]*>\s*Преимущества\s*<\/span>[\s\S]*?<div[^>]*class=["']panel["'][^>]*>([\s\S]*?)<\/div>/iu)?.[1];
  if (!section) return undefined;

  const items = [...section.matchAll(/<li>([\s\S]*?)<\/li>/giu)]
    .map((match) => decodeHtml(match[1]))
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

type DetailPageMetadata = {
  amountMin?: number;
  amountMax?: number;
  termMin?: number;
  termMax?: number;
  issueMethod?: string;
  description?: string;
  features?: string[];
};

function parseDetailPageFields(html: string): DetailPageMetadata {
  const table = parseOrganizationTable(html);
  const metadata: DetailPageMetadata = {};

  const amountRow = table.get("сумма");
  if (amountRow) {
    const range = parseCombinedRange(amountRow);
    if (range.min != null) metadata.amountMin = range.min;
    if (range.max != null) metadata.amountMax = range.max;
  }

  const termRow = table.get("срок");
  if (termRow) {
    const range = parseCombinedRange(termRow);
    if (range.min != null) metadata.termMin = range.min;
    if (range.max != null) metadata.termMax = range.max;
  }

  const issueMethodRow = table.get("способ выплаты");
  if (issueMethodRow) metadata.issueMethod = issueMethodRow;

  const description = html.match(/<p[^>]*class=["']lead-text["'][^>]*>([\s\S]*?)<\/p>/iu)?.[1];
  if (description) metadata.description = decodeHtml(description);

  metadata.features = parseAdvantages(html);

  return metadata;
}

async function fetchDetailPage(href: string) {
  try {
    const url = new URL(href, VSEZAIMYONLINE_URL).toString();
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.log(`  не удалось загрузить страницу партнёра ${href}: ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

function getServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be set for offer metadata sync.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function syncOfferMetadata() {
  const supabase = getServiceSupabaseClient();

  const { data: offers, error: selectError } = await supabase.from("offers").select(
    `id, company, amount_min, amount_max, term_min, term_max, rate, first_loan, interest_free_term, decision_time, min_age, max_age, issue_method, additional_features, description, features`
  );

  if (selectError) {
    throw new Error(`Could not load offers for metadata sync: ${selectError.message}`);
  }

  const response = await fetch(VSEZAIMYONLINE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${VSEZAIMYONLINE_URL}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const cardMap = buildCompanyCardMap(html);

  const summary: SyncMetadataSummary = {
    found: 0,
    updated: 0,
    skipped: 0,
    notFound: 0,
    details: [],
  };

  for (const offer of offers ?? []) {
    const card = findCompanyCard(offer.company, cardMap);

    if (!card) {
      console.log(`✗ не найдено: ${offer.company}`);
      summary.notFound += 1;
      summary.details.push({ company: offer.company, status: "not-found" });
      continue;
    }

    summary.found += 1;
    console.log(`✓ найдено: ${offer.company}`);

    const cardMetadata = parseOfferCardFields(card.cardHtml);

    let detail: DetailPageMetadata | null = null;
    if (card.href) {
      const detailHtml = await fetchDetailPage(card.href);
      if (detailHtml) detail = parseDetailPageFields(detailHtml);
      await sleep(DETAIL_PAGE_DELAY_MS);
    }

    const firstLoanBadge = findFirstLoanBadge(offer.company, html);

    const combined = {
      amountMin: detail?.amountMin ?? cardMetadata.amountMin,
      amountMax: detail?.amountMax ?? cardMetadata.amountMax,
      termMin: detail?.termMin ?? cardMetadata.termMin,
      termMax: detail?.termMax ?? cardMetadata.termMax,
      rate: cardMetadata.rate,
      interestFreeTerm: cardMetadata.interestFreeTerm,
      decisionTime: cardMetadata.decisionTime,
      minAge: cardMetadata.minAge,
      maxAge: cardMetadata.maxAge,
      issueMethod: detail?.issueMethod ?? cardMetadata.issueMethod,
      additionalFeatures: cardMetadata.additionalFeatures,
      description: detail?.description,
      features: detail?.features,
      firstLoan: firstLoanBadge ?? undefined,
    };

    const updatePayload: Record<string, unknown> = {};
    const updatedFields: string[] = [];

    if (offer.amount_min == null && combined.amountMin != null) {
      updatePayload.amount_min = combined.amountMin;
      updatedFields.push("amount_min");
    }
    if (offer.amount_max == null && combined.amountMax != null) {
      updatePayload.amount_max = combined.amountMax;
      updatedFields.push("amount_max");
    }
    if (offer.term_min == null && combined.termMin != null) {
      updatePayload.term_min = combined.termMin;
      updatedFields.push("term_min");
    }
    if (offer.term_max == null && combined.termMax != null) {
      updatePayload.term_max = combined.termMax;
      updatedFields.push("term_max");
    }
    if (offer.rate == null && combined.rate != null) {
      updatePayload.rate = combined.rate;
      updatedFields.push("rate");
    }
    if (offer.first_loan == null && combined.firstLoan != null) {
      updatePayload.first_loan = combined.firstLoan;
      updatedFields.push("first_loan");
    }
    if (offer.interest_free_term == null && combined.interestFreeTerm != null) {
      updatePayload.interest_free_term = combined.interestFreeTerm;
      updatedFields.push("interest_free_term");
    }
    if (offer.decision_time == null && combined.decisionTime != null) {
      updatePayload.decision_time = combined.decisionTime;
      updatedFields.push("decision_time");
    }
    if (offer.min_age == null && combined.minAge != null) {
      updatePayload.min_age = combined.minAge;
      updatedFields.push("min_age");
    }
    if (offer.max_age == null && combined.maxAge != null) {
      updatePayload.max_age = combined.maxAge;
      updatedFields.push("max_age");
    }
    if (offer.issue_method == null && combined.issueMethod != null) {
      updatePayload.issue_method = combined.issueMethod;
      updatedFields.push("issue_method");
    }
    if (offer.additional_features == null && combined.additionalFeatures != null) {
      updatePayload.additional_features = combined.additionalFeatures;
      updatedFields.push("additional_features");
    }
    if (offer.description == null && combined.description != null) {
      updatePayload.description = combined.description;
      updatedFields.push("description");
    }
    if ((offer.features == null || offer.features.length === 0) && combined.features != null) {
      updatePayload.features = combined.features;
      updatedFields.push("features");
    }

    if (Object.keys(updatePayload).length === 0) {
      console.log(`→ пропущено: ${offer.company}`);
      summary.skipped += 1;
      summary.details.push({ company: offer.company, status: "skipped" });
      continue;
    }

    const { error: updateError } = await supabase.from("offers").update(updatePayload).eq("id", offer.id);
    if (updateError) {
      throw new Error(`Could not update offer ${offer.company}: ${updateError.message}`);
    }

    console.log(`✓ обновлено: ${offer.company} (${updatedFields.join(", ")})`);
    summary.updated += 1;
    summary.details.push({ company: offer.company, status: "updated", updatedFields });
  }

  return summary;
}

function readEnvFile(source: string) {
  return Object.fromEntries(
    source.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)=(.*)\s*$/);
      return match ? [[match[1], match[2].replace(/^['"]|['"]$/g, "")]] : [];
    })
  );
}

async function loadLocalEnv() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const source = await readFile(resolve(".env.local"), "utf8");
    for (const [key, value] of Object.entries(readEnvFile(source))) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env.local is optional if the environment already provides Supabase credentials.
  }
}

async function main() {
  await loadLocalEnv();
  const summary = await syncOfferMetadata();
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1]?.endsWith("vsezaimyonline.ts")) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
