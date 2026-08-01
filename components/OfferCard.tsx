import Image from "next/image";
import { ArrowRight, Banknote, CalendarDays, type LucideIcon, Percent, Send, UserRound, Zap } from "lucide-react";
import type { Offer } from "@/lib/catalog";
import { getOfferBadges, type OfferBadge } from "@/lib/offerBadges";
import { logoMap } from "@/components/logoMap";

type Props = { offer: Offer };

type Chip = {
  key: string;
  icon: LucideIcon;
  value: string | null;
};

const TONE_CLASSES: Record<OfferBadge["tone"], string> = {
  amber: "bg-amber-50 text-amber-800",
  violet: "bg-violet-50 text-violet-800",
  blue: "bg-blue-50 text-blue-800",
  slate: "bg-slate-100 text-slate-700",
};

function formatAmount(amountMin: number | null, amountMax: number | null) {
  if (amountMin != null && amountMax != null) return `${amountMin.toLocaleString("ru-RU")}–${amountMax.toLocaleString("ru-RU")} ₽`;
  if (amountMax != null) return `до ${amountMax.toLocaleString("ru-RU")} ₽`;
  if (amountMin != null) return `от ${amountMin.toLocaleString("ru-RU")} ₽`;
  return null;
}

function formatTerm(termMin: number | null, termMax: number | null) {
  if (termMin != null && termMax != null) return `${termMin}–${termMax} дн.`;
  if (termMax != null) return `до ${termMax} дн.`;
  if (termMin != null) return `от ${termMin} дн.`;
  return null;
}

function formatAge(minAge: number | null, maxAge: number | null) {
  if (minAge != null && maxAge != null) return `${minAge}–${maxAge} лет`;
  if (minAge != null) return `от ${minAge} лет`;
  if (maxAge != null) return `до ${maxAge} лет`;
  return null;
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
  const badges = getOfferBadges(offer);
  const isMikrozaymy = offer.category.trim() === "Микрозаймы";
  const withDefault = (value: string | null, fallback: string) => value ?? (isMikrozaymy ? fallback : null);

  const decisionTime = withDefault(offer.decisionTime, MIKROZAYMY_DEFAULTS.decisionTime);

  const chips: Chip[] = [
    { key: "amount", icon: Banknote, value: withDefault(formatAmount(offer.amountMin, offer.amountMax), MIKROZAYMY_DEFAULTS.amount) },
    { key: "term", icon: CalendarDays, value: withDefault(formatTerm(offer.termMin, offer.termMax), MIKROZAYMY_DEFAULTS.term) },
    { key: "rate", icon: Percent, value: withDefault(offer.rate, MIKROZAYMY_DEFAULTS.rate) },
    { key: "decision", icon: Zap, value: decisionTime ? `Решение ${decisionTime}` : null },
    { key: "issue", icon: Send, value: withDefault(offer.issueMethod, MIKROZAYMY_DEFAULTS.issueMethod) },
    { key: "age", icon: UserRound, value: withDefault(formatAge(offer.minAge, offer.maxAge), MIKROZAYMY_DEFAULTS.age) },
  ].filter((chip): chip is Chip & { value: string } => Boolean(chip.value));

  const hasExtraInfo = Boolean(offer.interestFreeTerm || offer.additionalFeatures?.length || offer.features?.length || offer.description);
  const hasAnyDetails = chips.length > 0 || badges.length > 0 || hasExtraInfo;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)] sm:rounded-[1.4rem] sm:p-5">
      <div className="flex items-start gap-2.5 sm:gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 sm:h-14 sm:w-14 sm:rounded-2xl">
          {logo ? (
            <Image src={logo} alt={offer.company} width={56} height={56} className="h-7 w-auto object-contain sm:h-9" />
          ) : (
            <span className="text-sm font-black text-slate-300 sm:text-lg" aria-label={`Логотип ${offer.company} пока не добавлен`}>
              {offer.company.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-[14px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-lg ${offer.productName ? "truncate" : "line-clamp-2"}`}>{offer.company}</h3>
            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-emerald-600 sm:text-[11px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Онлайн
            </span>
          </div>
          {offer.productName ? <p className="truncate text-[11px] leading-tight text-slate-500 sm:mt-0.5 sm:text-sm">{offer.productName}</p> : null}

          {badges.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-1.5">
              {badges.map((badge) => (
                <span key={badge.key} className={`inline-flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold leading-4 sm:rounded-lg sm:px-2 sm:py-1 sm:text-[11px] ${TONE_CLASSES[badge.tone]}`}>
                  <badge.icon className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" aria-hidden />
                  <span className="truncate">{badge.label}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1 sm:mt-3.5 sm:gap-x-4 sm:gap-y-1.5">
        {chips.map((chip) => (
          <div key={chip.key} className="flex items-center gap-1 sm:gap-1.5">
            <chip.icon className="h-3 w-3 shrink-0 text-emerald-600 sm:h-3.5 sm:w-3.5" aria-hidden />
            <span className="text-[11px] font-bold leading-none text-slate-800 sm:text-[13px]">{chip.value}</span>
          </div>
        ))}
      </div>

      {hasExtraInfo ? (
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-slate-500 sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
          {[offer.interestFreeTerm, ...(offer.features ?? []), ...(offer.additionalFeatures ?? []), offer.description].filter(Boolean).join(" · ")}
        </p>
      ) : !hasAnyDetails ? (
        <p className="mt-1.5 text-[11px] italic leading-4 text-slate-400 sm:mt-3 sm:text-sm">
          Точные условия — на сайте партнёра
        </p>
      ) : null}

      <div className="mt-auto pt-2 sm:pt-4">
        <a
          href={offer.affiliateUrl}
          target="_blank"
          rel="noreferrer sponsored"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-[7px] text-[12.5px] font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] sm:rounded-xl sm:py-2.5 sm:text-sm sm:font-black"
        >
          Получить деньги <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
