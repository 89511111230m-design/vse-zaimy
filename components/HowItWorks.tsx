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
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Просто и понятно
          </span>

          <h2 className="mt-5 text-4xl font-black text-slate-900">
            Как это работает
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Найдите подходящий финансовый продукт всего за несколько шагов.
          </p>
        </div>


        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="absolute right-6 top-5 text-5xl font-black text-slate-100">
                  {step.number}
                </div>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
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