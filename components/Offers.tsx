import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleAlert } from "lucide-react";
import { categorySlug, offerCategories, type Offer } from "@/lib/catalog";
import OfferCard from "@/components/OfferCard";

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
          <div className="mt-8 grid grid-cols-1 items-stretch gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {offers.slice(0, 3).map((offer) => <OfferCard key={offer.id} offer={offer} />)}
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
