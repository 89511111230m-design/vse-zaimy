import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleAlert } from "lucide-react";
import { categorySlug, offerCategories, type Offer } from "@/lib/catalog";
import { logoMap } from "@/components/logoMap";

function formatAmount(amountMin: number | null, amountMax: number | null) {
  if (amountMin != null && amountMax != null) return `от ${amountMin} до ${amountMax} ₽`;
  if (amountMin != null) return `${amountMin} ₽`;
  if (amountMax != null) return `${amountMax} ₽`;
  return "—";
}

function formatTerm(termMin: number | null, termMax: number | null) {
  if (termMin != null && termMax != null) return `от ${termMin} до ${termMax} дней`;
  if (termMin != null) return `${termMin} дней`;
  if (termMax != null) return `${termMax} дней`;
  return "—";
}

function formatRate(value: string | null) {
  return value ?? null;
}

function formatDecision(offer: Offer) {
  if (offer.firstLoan) return offer.firstLoan;
  if (offer.badge) return offer.badge;
  return "Онлайн";
}

export default function Offers({ offers }: { offers: Offer[] }) {
  const categories = offerCategories(offers);

  return (
    <section id="offers" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              Каталог
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Финансовые продукты
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Опубликованные предложения из каталога партнёров.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:translate-x-1 hover:text-blue-800"
          >
            Открыть весь каталог <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {offers.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {offers.slice(0, 3).map((offer) => {
              const logo = logoMap[offer.company];
              const amount = formatAmount(offer.amountMin, offer.amountMax);
              const term = formatTerm(offer.termMin, offer.termMax);
              const rate = formatRate(offer.rate);
              const decision = formatDecision(offer);

              return (
                <article
                  key={offer.id}
                  className="group flex h-full flex-col rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-300/20 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
                        {logo ? (
                          <Image src={logo} alt={offer.company} width={56} height={56} className="h-10 w-auto object-contain" />
                        ) : (
                          <span className="text-sm font-semibold text-slate-400">?</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Партнёр</p>
                        <h3 className="truncate text-base font-semibold tracking-tight text-slate-950">{offer.company}</h3>
                        {offer.productName ? (
                          <p className="mt-1 truncate text-sm text-slate-500">{offer.productName}</p>
                        ) : null}
                      </div>
                    </div>
                    {offer.badge ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                        {offer.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-500">
                    <div className="space-y-2">
                      {amount !== "—" ? (
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                          <span>Сумма</span>
                          <span className="font-semibold text-slate-950">{amount}</span>
                        </div>
                      ) : null}
                      {term !== "—" ? (
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                          <span>Срок</span>
                          <span className="font-semibold text-slate-950">{term}</span>
                        </div>
                      ) : null}
                      {rate ? (
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                          <span>Ставка</span>
                          <span className="font-semibold text-slate-950">{rate}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between gap-4 pt-2">
                        <span>Решение</span>
                        <span className="font-semibold text-slate-950">{decision}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={offer.affiliateUrl}
                    target="_blank"
                    rel="noreferrer sponsored"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[1.65rem] bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800"
                  >
                    Перейти <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 shadow-sm">
            <div className="flex gap-4">
              <CircleAlert className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-slate-900">Предложения обновляются</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  В публичном каталоге пока нет опубликованных программ.
                </p>
              </div>
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${categorySlug(category.name)}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/8"
              >
                <span>
                  <span className="block font-bold text-slate-900">{category.name}</span>
                  <span className="mt-1.5 block text-sm leading-5 text-slate-500">
                    Опубликованные предложения категории.
                  </span>
                </span>
                <BadgeCheck
                  className="ml-4 shrink-0 text-blue-600 transition group-hover:scale-110"
                  size={20}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
