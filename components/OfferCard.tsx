import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Offer } from "@/lib/catalog";
import { logoMap } from "@/components/logoMap";

type Props = { offer: Offer };

type Detail = {
  label: string;
  value: string | null;
};

function formatAmount(amountMin: number | null, amountMax: number | null) {
  if (amountMin != null && amountMax != null) return `от ${amountMin.toLocaleString("ru-RU")} до ${amountMax.toLocaleString("ru-RU")} ₽`;
  if (amountMax != null) return `до ${amountMax.toLocaleString("ru-RU")} ₽`;
  if (amountMin != null) return `от ${amountMin.toLocaleString("ru-RU")} ₽`;
  return null;
}

function formatTerm(termMin: number | null, termMax: number | null) {
  if (termMin != null && termMax != null) return `от ${termMin} до ${termMax} дней`;
  if (termMax != null) return `до ${termMax} дней`;
  if (termMin != null) return `от ${termMin} дней`;
  return null;
}

function formatAge(minAge: number | null, maxAge: number | null) {
  if (minAge != null && maxAge != null) return `от ${minAge} до ${maxAge} лет`;
  if (minAge != null) return `от ${minAge} лет`;
  if (maxAge != null) return `до ${maxAge} лет`;
  return null;
}

function getBadges(offer: Offer) {
  return [offer.firstLoan, offer.badge]
    .filter((value): value is string => Boolean(value?.trim()))
    .filter((value, index, values) => values.indexOf(value) === index);
}

const MIKROZAYMY_DEFAULTS = {
  amount: "до 30 000 ₽",
  term: "до 30 дней",
  rate: "от 0%",
  decisionTime: "15 минут",
  age: "от 18 лет",
  issueMethod: "на карту",
};

export default function OfferCard({ offer }: Props) {
  const logo = logoMap[offer.company.trim()];
  const badges = getBadges(offer);
  const isMikrozaymy = offer.category.trim() === "Микрозаймы";
  const withDefault = (value: string | null, fallback: string) => value ?? (isMikrozaymy ? fallback : null);

  const mainDetails: Detail[] = [
    { label: "Сумма", value: withDefault(formatAmount(offer.amountMin, offer.amountMax), MIKROZAYMY_DEFAULTS.amount) },
    { label: "Срок", value: withDefault(formatTerm(offer.termMin, offer.termMax), MIKROZAYMY_DEFAULTS.term) },
    { label: "Ставка", value: withDefault(offer.rate, MIKROZAYMY_DEFAULTS.rate) },
    { label: "Решение", value: withDefault(offer.decisionTime, MIKROZAYMY_DEFAULTS.decisionTime) },
  ].filter((detail): detail is { label: string; value: string } => Boolean(detail.value));
  const extraDetails: Detail[] = [
    { label: "Срок без %", value: offer.interestFreeTerm },
    { label: "Возраст", value: withDefault(formatAge(offer.minAge, offer.maxAge), MIKROZAYMY_DEFAULTS.age) },
    { label: "Получение", value: withDefault(offer.issueMethod, MIKROZAYMY_DEFAULTS.issueMethod) },
  ].filter((detail): detail is { label: string; value: string } => Boolean(detail.value));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_14px_rgb(15_23_42/0.06)] transition duration-200 hover:border-emerald-200 hover:shadow-[0_14px_30px_rgb(15_23_42/0.10)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(13rem,0.9fr)_minmax(0,2fr)_12rem] lg:items-center lg:gap-6">
        <div className="min-w-0 lg:border-r lg:border-slate-100 lg:pr-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
              {logo ? (
                <Image src={logo} alt={offer.company} width={64} height={64} className="h-11 w-auto object-contain" />
              ) : (
                <span className="text-lg font-bold text-slate-400" aria-label={`Логотип ${offer.company} пока не добавлен`}>?</span>
              )}
            </div>
            <div className="min-w-0 pt-1">
              <h3 className="text-lg font-bold leading-6 text-slate-900">{offer.company}</h3>
              {offer.productName ? <p className="mt-1 text-sm leading-5 text-slate-500">{offer.productName}</p> : null}
            </div>
          </div>

          {badges.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold leading-3 text-emerald-800">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:gap-x-4">
          {mainDetails.map((detail) => (
            <div key={detail.label} className="min-w-0 border-l-2 border-emerald-100 pl-3">
              <dt className="text-xs font-medium text-slate-500">{detail.label}</dt>
              <dd className="mt-1 text-sm font-bold leading-5 text-slate-900">{detail.value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <a href={offer.affiliateUrl} target="_blank" rel="noreferrer sponsored" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            Получить деньги <ArrowRight size={17} aria-hidden="true" />
          </a>
          <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">Переход на сайт партнёра</p>
        </div>
      </div>

      {(extraDetails.length > 0 || offer.additionalFeatures?.length || offer.features?.length || offer.description) ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          {extraDetails.length > 0 ? (
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {extraDetails.map((detail) => (
                <div key={detail.label} className="flex gap-1.5">
                  <dt className="text-slate-500">{detail.label}:</dt>
                  <dd className="font-medium text-slate-800">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {offer.additionalFeatures?.length ? <p className="mt-2 text-sm leading-6 text-slate-600">{offer.additionalFeatures.join(" · ")}</p> : null}
          {offer.features?.length ? <p className="mt-2 text-sm leading-6 text-slate-600">{offer.features.join(" · ")}</p> : null}
          {offer.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{offer.description}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
