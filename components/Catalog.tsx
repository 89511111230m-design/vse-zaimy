"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, SearchX, SlidersHorizontal } from "lucide-react";
import { offerCategories, type Offer } from "@/lib/catalog";
import { logoMap } from "@/components/logoMap";

type Props = { offers: Offer[]; initialCategory?: string };

function formatRate(value: string | null) {
  return value ?? null;
}

function valueOrDash(value: string | number | null) {
  return value ?? "—";
}

function formatAmount(amountMin: number | null, amountMax: number | null) {
  if (amountMin != null && amountMax != null) {
    return `от ${amountMin} до ${amountMax} ₽`;
  }

  if (amountMin != null) return `${amountMin} ₽`;
  if (amountMax != null) return `${amountMax} ₽`;

  return "—";
}

function formatTerm(termMin: number | null, termMax: number | null) {
  if (termMin != null && termMax != null) {
    return `от ${termMin} до ${termMax} дней`;
  }

  if (termMin != null) return `${termMin} дней`;
  if (termMax != null) return `${termMax} дней`;

  return "—";
}

function formatDecision(offer: Offer) {
  if (offer.firstLoan) return offer.firstLoan;
  if (offer.badge) return offer.badge;
  return "Онлайн";
}

export default function Catalog({ offers, initialCategory }: Props) {
  const categories = useMemo(() => offerCategories(offers), [offers]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? "all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const filteredOffers = useMemo(
    () =>
      offers.filter(
        (offer) =>
          (selectedCategory === "all" || offer.category === selectedCategory) &&
          (!featuredOnly || Boolean(offer.badge))
      ),
    [offers, selectedCategory, featuredOnly]
  );

  return (
    <div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-blue-950/5 sm:p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <SlidersHorizontal size={18} className="text-blue-600" aria-hidden="true" />
          Настройте каталог
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${selectedCategory === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            Все направления
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${selectedCategory === category.name ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <label className="mt-6 inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => setFeaturedOnly(event.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Только с отметкой
        </label>
      </div>

      {filteredOffers.length > 0 ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((offer) => {
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
                      <h2 className="truncate text-base font-semibold tracking-tight text-slate-950">{offer.company}</h2>
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
        <div className="mt-7 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">
          <SearchX className="mx-auto text-slate-400" size={38} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">По этим параметрам пока нет предложений</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Измените фильтр или вернитесь позже: каталог
          </p>
        </div>
      )}
    </div>
  );
}
