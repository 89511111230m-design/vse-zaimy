"use client";

import {
  ShieldCheck,
  Clock3,
  SearchCheck,
  BadgeCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Проверенные организации",
    text: "Собираем предложения от надежных банков и финансовых компаний.",
  },
  {
    icon: Clock3,
    title: "Быстрый подбор",
    text: "Помогаем найти подходящий финансовый продукт за несколько минут.",
  },
  {
    icon: SearchCheck,
    title: "Удобное сравнение",
    text: "Сравнивайте условия разных предложений в одном месте.",
  },
  {
    icon: BadgeCheck,
    title: "Прозрачные условия",
    text: "Показываем основные параметры продуктов без лишней информации.",
  },
  {
    icon: Smartphone,
    title: "Удобно с любого устройства",
    text: "Пользуйтесь сервисом с телефона, планшета или компьютера.",
  },
  {
    icon: Wallet,
    title: "Все финансовые продукты",
    text: "Микрозаймы, карты, кредиты, РКО и страхование в одном месте.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">

        <div className="mb-10 text-center sm:mb-14">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Прозрачный подход</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Почему выбирают ВСЕ ЗАЙМЫ
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Мы собрали лучшие финансовые предложения в одном месте.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/8 sm:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/20">
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 text-xl font-black tracking-tight text-slate-950">
                  {item.title}
                </h3>

                <p className="leading-7 text-slate-600">
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
