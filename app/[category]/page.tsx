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
  return <><Header /><main className="bg-slate-50"><section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20"><span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">Финансовые продукты</span><h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{category.name}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Изучите опубликованные предложения и уточните итоговые условия на сайте финансовой организации.</p><div className="mt-10"><Catalog offers={offers} initialCategory={category.name} /></div></section></main><LeadForm defaultCategory={category.name} categories={offerCategories(offers).map((item) => item.name)} /><Footer /></>;
}
