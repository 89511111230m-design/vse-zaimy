import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import { offerCategories } from "@/lib/catalog";
import { getPublishedOffers } from "@/lib/supabase";

export const revalidate = 300;

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const offers = await getPublishedOffers();
  return offerCategories(offers).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = offerCategories(await getPublishedOffers()).find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: category.name,
    description: `Опубликованные предложения категории «${category.name}».`,
    alternates: { canonical: `/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const offers = await getPublishedOffers();
  const category = offerCategories(offers).find((item) => item.slug === slug);
  if (!category) notFound();
  return <><Header /><main className="bg-slate-50"><section className="mx-auto max-w-7xl px-4 pb-10 pt-3 sm:px-6 sm:py-20"><span className="inline-flex rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700 sm:px-4 sm:py-2 sm:text-sm">Финансовые продукты</span><h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:mt-5 sm:text-5xl">{category.name}</h1><p className="mt-2 hidden max-w-2xl text-sm leading-6 text-slate-600 sm:mt-5 sm:block sm:text-lg sm:leading-8">Изучите опубликованные предложения и уточните итоговые условия на сайте финансовой организации.</p><div className="mt-2.5 sm:mt-10"><Catalog offers={offers} initialCategory={category.name} /></div></section></main><LeadForm defaultCategory={category.name} categories={offerCategories(offers).map((item) => item.name)} /><Footer /></>;
}
