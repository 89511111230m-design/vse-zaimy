"use client";

import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { offerCategories, type Offer } from "@/lib/catalog";
import OfferCard from "@/components/OfferCard";

type Props = { offers: Offer[]; initialCategory?: string };

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
        <div className="mt-7 grid gap-4">
          {filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
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
