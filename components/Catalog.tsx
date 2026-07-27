"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, SearchX, SlidersHorizontal } from "lucide-react";
import { offerCategories, type Offer } from "@/lib/catalog";

type Props = { offers: Offer[]; initialCategory?: string };

function valueOrDash(value: string | number | null) {
  return value ?? "—";
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
          (!featuredOnly || Boolean(offer.badge)),
      ),
    [offers, selectedCategory, featuredOnly],
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
          {filteredOffers.map((offer) => (
            <article
              key={offer.id}
              className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-bold text-blue-700">{offer.company}</span>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{offer.category}</p>
                </div>
                {offer.badge && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {offer.badge}
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                {offer.productName || offer.company}
              </h2>

              {offer.description && <p className="mt-3 text-sm leading-6 text-slate-600">{offer.description}</p>}

              <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-slate-100 py-5 text-sm">
                <div>
                  <dt className="text-slate-500">Ставка</dt>
                  <dd className="mt-1 font-bold text-slate-900">{valueOrDash(offer.rate)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Сумма</dt>
                  <dd className="mt-1 font-bold text-slate-900">{valueOrDash(offer.amountMax)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Срок</dt>
                  <dd className="mt-1 font-bold text-slate-900">{valueOrDash(offer.termMax)}</dd>
                </div>
              </dl>

              <a
                href={offer.affiliateUrl}
                target="_blank"
                rel="noreferrer sponsored"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:translate-x-1 hover:text-blue-800"
              >
                Перейти к условиям <ExternalLink size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">
          <SearchX className="mx-auto text-slate-400" size={38} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">По этим параметрам пока нет предложений</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Измените фильтр или вернитесь позже: каталог пополняется после проверки условий партнёров.
          </p>
        </div>
      )}
    </div>
  );
}
