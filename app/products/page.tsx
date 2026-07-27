import type { Metadata } from "next";
import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import { getPublishedOffers } from "@/lib/supabase";
import { offerCategories } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Каталог финансовых продуктов",
  description:
    "Сравнивайте опубликованные финансовые предложения по категориям и условиям.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const offers = await getPublishedOffers();

  return (
    <>
      <Header />

      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            Все направления
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Каталог финансовых продуктов
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Изучайте опубликованные предложения, фильтруйте их по категории и
            переходите к условиям партнёра.
          </p>

          <div className="mt-10">
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