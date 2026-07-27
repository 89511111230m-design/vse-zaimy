"use client";

import { ArrowRight, BadgeCheck, Building2, CheckCircle2, Clock3, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { saveLeadParams } from "@/lib/lead-params";

const benefits = [
  { icon: CheckCircle2, text: "Бесплатный подбор" },
  { icon: BadgeCheck, text: "Без скрытых комиссий" },
  { icon: Building2, text: "Несколько финансовых организаций" },
  { icon: Clock3, text: "Ответ за несколько минут" },
];

export default function Hero() {
  const [amount, setAmount] = useState(30000);
  const [term, setTerm] = useState(30);

  const scrollToForm = () => {
    saveLeadParams({ amount, term });
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-surface relative isolate overflow-hidden bg-gradient-to-br from-white via-blue-50/70 to-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><div className="motion-glow absolute -left-24 top-8 h-64 w-64 rounded-full bg-blue-200/45 blur-3xl sm:h-96 sm:w-96" /><div className="motion-float absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-100/80 blur-3xl sm:h-96 sm:w-96" /><div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-200 to-transparent" /></div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16">
        <div className="motion-reveal relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-bold text-green-700 shadow-sm backdrop-blur"><CheckCircle2 size={15} aria-hidden="true" />Подбор по вашим параметрам</div>
          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.25rem]">Финансовые решения, <span className="relative whitespace-nowrap text-blue-600">понятные вам<span className="absolute -bottom-2 left-0 h-2 w-full -rotate-1 rounded-full bg-blue-200/80" /></span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Сравнивайте ключевые условия в одном месте и выбирайте продукт под вашу задачу — спокойно, прозрачно, без лишней сложности.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><button type="button" onClick={scrollToForm} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Получить подборку <ArrowRight size={19} aria-hidden="true" /></button><span className="text-sm font-medium text-slate-500">Вы сами выбираете подходящее предложение</span></div>
          <ul className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">{benefits.map((benefit) => { const Icon = benefit.icon; return <li key={benefit.text} className="flex items-center gap-3 rounded-2xl border border-white/90 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={17} aria-hidden="true" /></span>{benefit.text}</li>; })}</ul>
        </div>

        <div className="premium-card motion-reveal-delay relative rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-blue-950/15 backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute -inset-px -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200/80 via-transparent to-cyan-100/80" />
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"><SlidersHorizontal size={22} aria-hidden="true" /></div><div><p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Калькулятор</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Настройте подбор</h2><p className="mt-1 text-sm text-slate-500">Укажите желаемые сумму и срок</p></div></div>
          <div className="mt-8 rounded-2xl bg-slate-50 p-5 sm:p-6"><div className="flex items-baseline justify-between gap-4"><span className="font-bold text-slate-800">Сумма</span><output className="text-xl font-black tracking-tight text-blue-700">{amount.toLocaleString("ru-RU")} ₽</output></div><input aria-label="Сумма займа" type="range" min="1000" max="100000" step="1000" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-5 w-full cursor-pointer" /><div className="mt-2 flex justify-between text-xs font-medium text-slate-400"><span>1 000 ₽</span><span>100 000 ₽</span></div></div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-5 sm:p-6"><div className="flex items-baseline justify-between gap-4"><span className="font-bold text-slate-800">Срок</span><output className="text-xl font-black tracking-tight text-blue-700">{term} дней</output></div><input aria-label="Срок займа" type="range" min="7" max="365" value={term} onChange={(event) => setTerm(Number(event.target.value))} className="mt-5 w-full cursor-pointer" /><div className="mt-2 flex justify-between text-xs font-medium text-slate-400"><span>7 дней</span><span>365 дней</span></div></div>
          <button type="button" onClick={scrollToForm} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-green-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600">Продолжить к заявке <ArrowRight size={19} aria-hidden="true" /></button>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">Итоговые условия определяет финансовая организация.</p>
        </div>
      </div>
    </section>
  );
}