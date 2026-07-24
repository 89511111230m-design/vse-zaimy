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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">
            Почему выбирают ВСЕ ЗАЙМЫ
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Мы собрали лучшие финансовые предложения в одном месте.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-900">
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