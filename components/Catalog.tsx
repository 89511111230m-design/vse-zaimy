"use client";

import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { offerCategories, type Offer } from "@/lib/catalog";
import { hasOfferBadges } from "@/lib/offerBadges";
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
          (!featuredOnly || hasOfferBadges(offer))
      ),
    [offers, selectedCategory, featuredOnly]
  );

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:rounded-[1.75rem] sm:p-7 sm:shadow-lg sm:shadow-blue-950/5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 sm:gap-2 sm:text-sm">
          <SlidersHorizontal size={14} className="text-blue-600 sm:h-4 sm:w-4" aria-hidden="true" />
          Настройте каталог
        </div>

        <div className="relative">
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-5 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-bold transition-all duration-200 ease-out sm:px-4 sm:py-2.5 sm:text-sm ${selectedCategory === "all" ? "scale-100 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "scale-100 bg-slate-100 text-slate-700 hover:scale-[1.03] hover:bg-slate-200"}`}
            >
              Все направления
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`shrink-0 rounded-full px-3 py-1 text-[11.5px] font-bold transition-all duration-200 ease-out sm:px-4 sm:py-2.5 sm:text-sm ${selectedCategory === category.name ? "scale-100 bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "scale-100 bg-slate-100 text-slate-700 hover:scale-[1.03] hover:bg-slate-200"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent sm:hidden" aria-hidden />
        </div>

        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-slate-700 sm:mt-6 sm:gap-3 sm:text-sm">
          <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-slate-200 transition-colors duration-200 ease-out has-[:checked]:bg-blue-600">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(event) => setFeaturedOnly(event.target.checked)}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span className="pointer-events-none ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-out peer-checked:translate-x-4" />
          </span>
          Только с выгодными условиями
        </label>
      </div>

      {filteredOffers.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 items-stretch gap-2 sm:mt-7 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm sm:mt-7 sm:rounded-[1.75rem] sm:p-10">
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
