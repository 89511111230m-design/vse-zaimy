import type { Metadata } from "next";
import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import { getCatalogOffers } from "@/lib/supabase";
import { offerCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог финансовых продуктов",
  description:
    "Сравнивайте опубликованные финансовые предложения по категориям и условиям.",
};

export default async function ProductsPage() {
  const offers = await getCatalogOffers();

  return (
    <>
      <Header />

      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-3 sm:px-6 sm:py-20">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700 sm:px-4 sm:py-2 sm:text-sm">
            Все направления
          </span>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:mt-5 sm:text-5xl">
            Каталог финансовых продуктов
          </h1>

          <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-slate-600 sm:mt-5 sm:block sm:text-lg sm:leading-8">
            Изучайте опубликованные предложения, фильтруйте их по категории и
            переходите к условиям партнёра.
          </p>

          <div className="mt-2.5 sm:mt-10">
            <Catalog offers={offers} />
          </div>
        </section>
      </main>

      <LeadForm
        categories={offerCategories(offers).map((category) => category.name)}
      />

      <Footer />
    </>
  );
}