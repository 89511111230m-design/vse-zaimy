import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

type ImportedOffer = { company: string; productName: string | null; category: string; affiliateUrl: string };
type ImportSummary = { found: number; unique: number; created: number; updated: number; published: number; categories: string[]; dryRun: boolean; publish: boolean };

const forbiddenMetric = /(?:выплат[аы]?|комисси[яи]|\bcpa\b|\bepc\b|\bcr\b|доход)/iu;

function decodeHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&quot;/gi, '"').replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, (_, hex, decimal) => String.fromCodePoint(Number.parseInt(hex ?? decimal, hex ? 16 : 10))).replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

function categoryFor(text: string) {
  const normalized = text.toLocaleLowerCase("ru-RU");
  if (/кредитн\S* карт/.test(normalized)) return "Кредитные карты";
  if (/дебетов\S* карт/.test(normalized)) return "Дебетовые карты";
  if (/микрозайм|\bзайм/.test(normalized)) return "Микрозаймы";
  if (/\bрко\b|расч[её]тно-кассов/.test(normalized)) return "РКО";
  if (/страхов/.test(normalized)) return "Страхование";
  if (/кредит/.test(normalized)) return "Кредиты";
  return "Другое";
}

function companyFor(productName: string) {
  const normalized = productName.replace(/\s+/g, " ").trim();
  const separated = normalized.split(/\s*(?:—|–|\||\s-\s)\s*/u)[0]?.trim();
  if (separated && separated !== normalized) return separated;
  const bank = normalized.match(/^(.+?(?:[-\s]Банк|Банк|Деньги|МФО))\b/iu)?.[1]?.trim();
  return bank || normalized;
}

export function parsePartnerOffers(html: string): ImportedOffer[] {
  const starts = [...html.matchAll(/<div\b(?=[^>]*\bclass=["'][^"']*\bjs-product\b[^"']*["'])[^>]*>/giu)].map((match) => match.index ?? 0);
  const entries = starts.map((start, index) => html.slice(start, starts[index + 1] ?? html.length));
  const parsed = entries.flatMap((entry) => {
    const title = entry.match(/<div\b(?=[^>]*\bclass=["'][^"']*\bjs-product-name\b[^"']*["'])[^>]*>([\s\S]*?)<\/div>/iu)?.[1];
    const link = entry.match(/<a\b(?=[^>]*\bclass=["'][^"']*\bjs-product-link\b[^"']*["'])[^>]*\bhref=["']([^"']+)["']/iu)?.[1]
      ?? entry.match(/<a\b[^>]*\bhref=["'](https?:\/\/[^"']+)["']/iu)?.[1];
    const productName = title ? decodeHtml(title) : "";
    if (!productName || !link || forbiddenMetric.test(productName)) return [];
    return [{ company: companyFor(productName), productName, category: categoryFor(productName), affiliateUrl: decodeHtml(link) }];
  });
  return [...new Map(parsed.map((offer) => [offer.company.toLocaleLowerCase("ru-RU"), offer])).values()];
}

function readEnv(source: string) {
  return Object.fromEntries(source.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)=(.*)\s*$/);
    return match ? [[match[1], match[2].replace(/^['"]|['"]$/g, "")]] : [];
  }));
}

async function importOffers(offers: ImportedOffer[], dryRun: boolean, publish: boolean): Promise<Pick<ImportSummary, "created" | "updated" | "published">> {
  if (dryRun) return { created: offers.length, updated: 0, published: publish ? offers.length : 0 };
  const env = readEnv(await readFile(resolve(".env.local"), "utf8"));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Для импорта укажите NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env.local.");
  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  let created = 0;
  let updated = 0;
  let published = 0;
  for (const offer of offers) {
    const { data: existing, error: findError } = await supabase.from("offers").select("id").ilike("company", offer.company).maybeSingle();
    if (findError) throw new Error(`Не удалось проверить ${offer.company}: ${findError.message}`);
    const payload = {
      affiliate_url: offer.affiliateUrl,
      product_name: offer.productName,
      category: offer.category,
      ...(publish ? { is_published: true } : {}),
    };
    if (existing) {
      const { error } = await supabase.from("offers").update(payload).eq("id", existing.id);
      if (error) throw new Error(`Не удалось обновить ${offer.company}: ${error.message}`);
      updated += 1;
      if (publish) published += 1;
    } else {
      const { error } = await supabase.from("offers").insert({
        company: offer.company,
        product_name: offer.productName,
        category: offer.category,
        affiliate_url: offer.affiliateUrl,
        ...(publish ? { is_published: true } : {}),
      });
      if (error) throw new Error(`Не удалось создать ${offer.company}: ${error.message}`);
      created += 1;
      if (publish) published += 1;
    }
  }
  return { created, updated, published };
}

async function main() {
  const argumentsList = process.argv.slice(2);
  const fileIndex = argumentsList.indexOf("--file");
  const file = fileIndex >= 0 ? argumentsList[fileIndex + 1] : argumentsList[0];
  if (!file) throw new Error("Укажите HTML-файл: npm run import:offers -- --file path/to/partner.html [--dry-run] [--publish]");
  const offers = parsePartnerOffers(await readFile(resolve(file), "utf8"));
  const dryRun = argumentsList.includes("--dry-run");
  const publish = argumentsList.includes("--publish");
  const result = await importOffers(offers, dryRun, publish);
  const summary: ImportSummary = { found: offers.length, unique: offers.length, ...result, categories: [...new Set(offers.map((offer) => offer.category))].sort((a, b) => a.localeCompare(b, "ru")), dryRun, publish };
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1]?.endsWith("import-offers.ts")) main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
