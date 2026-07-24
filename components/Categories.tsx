"use client";

import {
  Wallet,
  CreditCard,
  Banknote,
  ShieldCheck,
} from "lucide-react";

const categories = [
  {
    icon: Wallet,
    title: "Микрозаймы",
    text: "Быстрое оформление займа онлайн",
  },
  {
    icon: CreditCard,
    title: "Банковские карты",
    text: "Подбор выгодных банковских продуктов",
  },
  {
    icon: Banknote,
    title: "Кредиты",
    text: "Подходящие кредитные решения",
  },
  {
    icon: ShieldCheck,
    title: "Страхование",
    text: "Защита ваших финансов",
  },
];

export default function Categories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-slate-900">
            Финансовые продукты
          </h2>

          <p className="mt-3 text-slate-600">
            Выберите подходящее направление
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 p-6 transition hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Icon size={28} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-slate-600">
                  {item.text}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}