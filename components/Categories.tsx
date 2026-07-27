import Link from "next/link";
import { Banknote, CreditCard, Landmark, ShieldCheck, Wallet } from "lucide-react";
import type { OfferCategory } from "@/lib/catalog";

const icons = [Wallet, CreditCard, Banknote, Landmark, ShieldCheck];

export default function Categories({ categories }: { categories: OfferCategory[] }) {
  if (categories.length === 0) return null;
  return <section className="bg-white py-16 sm:py-20 lg:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-6"><div className="mb-9 text-center sm:mb-12"><p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Выберите направление</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Финансовые продукты</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">Выберите категорию и изучите опубликованные предложения.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">{categories.map((category, index) => { const Icon = icons[index % icons.length]; return <Link key={category.slug} href={`/${category.slug}`} className="group rounded-[1.75rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:scale-105"><Icon size={28} /></div><h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">{category.name}</h3><p className="mt-3 text-sm leading-6 text-slate-600">Опубликованные предложения и ключевые условия.</p><span className="mt-6 inline-flex items-center text-sm font-bold text-blue-700 transition duration-200 group-hover:translate-x-1">Смотреть продукты →</span></Link>; })}</div></div></section>;
}
