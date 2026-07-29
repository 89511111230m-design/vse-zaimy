import { createClient } from "@supabase/supabase-js";
import type { Offer } from "../catalog";

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

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase("ru-RU");
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
  if (matches) age.min = parseInteger(matches[1]);
  const maxMatch = normalized.match(/до\s*(\d+)/i);
  if (maxMatch) age.max = parseInteger(maxMatch[1]);
  return age;
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

function buildCompanyCardMap(html: string) {
  const map = new Map<string, string>();
  const cardChunks = html.split(/<div\s+class=["']card-minimal\s+card[^"']*["'][^>]*>/gi).slice(1);

  for (const chunk of cardChunks) {
    const cardHtml = `<div class="card-minimal card">${chunk}`;
    const companyMatch = /<a[^>]*class=["']bank-name["'][^>]*>([^<]+)<\/a>/i.exec(cardHtml);
    if (!companyMatch) continue;
    const company = decodeHtml(companyMatch[1]);
    map.set(normalizeText(company), cardHtml);
  }

  return map;
}

function findCardHtml(company: string, cardMap: Map<string, string>) {
  const normalizedCompany = normalizeText(company);
  if (cardMap.has(normalizedCompany)) return cardMap.get(normalizedCompany) ?? null;

  for (const [key, cardHtml] of cardMap.entries()) {
    if (key.includes(normalizedCompany) || normalizedCompany.includes(key)) {
      return cardHtml;
    }
  }

  return null;
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
    `id, company, amount_min, amount_max, term_min, term_max, rate, first_loan, interest_free_term, decision_time, min_age, max_age, issue_method, additional_features`
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
    const cardHtml = findCardHtml(offer.company, cardMap);

    if (!cardHtml) {
      console.log(`✗ не найдено: ${offer.company}`);
      summary.notFound += 1;
      summary.details.push({ company: offer.company, status: "not-found" });
      continue;
    }

    summary.found += 1;
    console.log(`✓ найдено: ${offer.company}`);

    const metadata = parseOfferCardFields(cardHtml);
    const updatePayload: Record<string, unknown> = {};
    const updatedFields: string[] = [];

    if (offer.amount_max == null && metadata.amountMax != null) {
      updatePayload.amount_max = metadata.amountMax;
      updatedFields.push("amount_max");
    }
    if (offer.term_max == null && metadata.termMax != null) {
      updatePayload.term_max = metadata.termMax;
      updatedFields.push("term_max");
    }
    if (offer.rate == null && metadata.rate != null) {
      updatePayload.rate = metadata.rate;
      updatedFields.push("rate");
    }
    if (offer.interest_free_term == null && metadata.interestFreeTerm != null) {
      updatePayload.interest_free_term = metadata.interestFreeTerm;
      updatedFields.push("interest_free_term");
    }
    if (offer.decision_time == null && metadata.decisionTime != null) {
      updatePayload.decision_time = metadata.decisionTime;
      updatedFields.push("decision_time");
    }
    if (offer.min_age == null && metadata.minAge != null) {
      updatePayload.min_age = metadata.minAge;
      updatedFields.push("min_age");
    }
    if (offer.max_age == null && metadata.maxAge != null) {
      updatePayload.max_age = metadata.maxAge;
      updatedFields.push("max_age");
    }
    if (offer.issue_method == null && metadata.issueMethod != null) {
      updatePayload.issue_method = metadata.issueMethod;
      updatedFields.push("issue_method");
    }
    if (offer.additional_features == null && metadata.additionalFeatures != null) {
      updatePayload.additional_features = metadata.additionalFeatures;
      updatedFields.push("additional_features");
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
