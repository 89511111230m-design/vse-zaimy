"use client";

import {
  MousePointerClick,
  Search,
  FileCheck,
  PartyPopper,
} from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    number: "01",
    title: "Выберите продукт",
    text: "Определите, что вам нужно: микрозайм, карта, кредит, РКО или страхование.",
  },
  {
    icon: Search,
    number: "02",
    title: "Сравните предложения",
    text: "Изучите условия разных финансовых организаций и выберите подходящий вариант.",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Оставьте заявку",
    text: "Перейдите на сайт партнера и заполните простую форму заявки.",
  },
  {
    icon: PartyPopper,
    number: "04",
    title: "Получите решение",
    text: "Получите ответ от финансовой организации и оформите продукт.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">

        <div className="mb-10 text-center sm:mb-14">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Просто и понятно
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Как это работает
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 sm:text-lg">
            Найдите подходящий финансовый продукт всего за несколько шагов.
          </p>
        </div>


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-[1.75rem] border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/8 sm:p-8"
              >

                <div className="absolute right-6 top-5 text-5xl font-black text-slate-100">
                  {step.number}
                </div>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/20">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.text}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
