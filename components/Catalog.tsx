"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, SearchX, SlidersHorizontal } from "lucide-react";
import { offerCategories, type Offer } from "@/lib/catalog";
import { hasOfferBadges } from "@/lib/offerBadges";
import { consumePendingLeadCategory, onLeadCatalogFilter } from "@/lib/leadCatalogBridge";
import OfferCard from "@/components/OfferCard";

type Props = { offers: Offer[]; initialCategory?: string };

export default function Catalog({ offers, initialCategory }: Props) {
  const categories = useMemo(() => offerCategories(offers), [offers]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? "all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showLeadBanner, setShowLeadBanner] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredOffers = useMemo(
    () =>
      offers.filter(
        (offer) =>
          (selectedCategory === "all" || offer.category === selectedCategory) &&
          (!featuredOnly || hasOfferBadges(offer))
      ),
    [offers, selectedCategory, featuredOnly]
  );

  // Applies a category chosen in the lead form: switches the filter, shows a
  // short confirmation banner and smooth-scrolls straight to the offer list
  // (skipping the heading/filters) so the user never lands "in the void".
  const applyLeadCategory = useCallback((category: string) => {
    // Guard against a stale/unknown category (e.g. offers changed, or the
    // form ran on a page with a different catalog) - fall back to the full
    // catalog instead of a filter that matches nothing.
    const isKnownCategory = category === "all" || categories.some((item) => item.name === category);
    setSelectedCategory(isKnownCategory ? category : "all");
    setFeaturedOnly(false);
    setShowLeadBanner(true);

    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => setShowLeadBanner(false), 4500);

    const dismissBanner = () => setShowLeadBanner(false);
    // Only start listening for the *user's* scroll once our own auto-scroll
    // has actually finished - otherwise the animated scroll (which can span
    // a long distance from a bottom-of-page form up to the catalog) fires
    // its own scroll events and would dismiss the banner instantly.
    const armDismissOnUserScroll = () => {
      window.addEventListener("scroll", dismissBanner, { once: true, passive: true });
    };

    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", armDismissOnUserScroll, { once: true });
    } else {
      // Fallback for browsers without the scrollend event.
      dismissTimerRef.current = setTimeout(armDismissOnUserScroll, 1500);
    }

    // Double rAF: wait for the filtered list (and banner) to paint before measuring scroll position.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, [categories]);

  useEffect(() => {
    const pendingCategory = consumePendingLeadCategory();
    if (!pendingCategory) return;
    // Deferred via a microtask (not called synchronously in the effect body)
    // so this reads as "react to an external signal" rather than an
    // unconditional sync setState-on-mount. Unlike setTimeout, a queued
    // microtask cannot be cancelled by React's dev-mode Strict Mode
    // mount->cleanup->mount cycle, so the read-once sessionStorage value
    // (already consumed above) is never silently dropped.
    queueMicrotask(() => applyLeadCategory(pendingCategory));
  }, [applyLeadCategory]);

  useEffect(() => onLeadCatalogFilter(applyLeadCategory), [applyLeadCategory]);

  useEffect(
    () => () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    },
    []
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

      <div id="catalog-cards" ref={cardsRef} className="mt-3 scroll-mt-16 sm:mt-7 sm:scroll-mt-24">
        {showLeadBanner && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12.5px] font-semibold text-emerald-800 shadow-sm sm:mb-4 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
            Мы подобрали для вас наиболее подходящие предложения.
          </div>
        )}

        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm sm:rounded-[1.75rem] sm:p-10">
            <SearchX className="mx-auto text-slate-400" size={38} aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">По этим параметрам пока нет предложений</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Измените фильтр или вернитесь позже: каталог
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
