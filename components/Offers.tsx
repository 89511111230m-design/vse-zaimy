"use client";

import {
  ArrowRight,
  BadgePercent,
  Calendar,
  Star,
  Wallet,
} from "lucide-react";

const offers = [
  {
    id: 1,
    company: "Займер",
    rating: "4.9",
    amount: "до 30 000 ₽",
    term: "до 30 дней",
    percent: "0%",
    color: "bg-green-500",
  },
  {
    id: 2,
    company: "MoneyMan",
    rating: "4.8",
    amount: "до 100 000 ₽",
    term: "до 365 дней",
    percent: "от 0%",
    color: "bg-blue-500",
  },
  {
    id: 3,
    company: "еКапуста",
    rating: "4.9",
    amount: "до 30 000 ₽",
    term: "до 21 дня",
    percent: "0%",
    color: "bg-emerald-500",
  },
  {
    id: 4,
    company: "Webbankir",
    rating: "4.7",
    amount: "до 98 000 ₽",
    term: "до 365 дней",
    percent: "от 0%",
    color: "bg-purple-500",
  },
];

export default function Offers() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Лучшие предложения
          </span>

          <h2 className="mt-5 text-5xl font-black text-slate-900">
            Популярные микрозаймы
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Мы собрали самые востребованные предложения
            от надежных микрофинансовых организаций.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {offers.map((offer) => (

            <div
              key={offer.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-5">

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white ${offer.color}`}
                  >
                    {offer.company.charAt(0)}
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">
                      {offer.company}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">

                      <Star
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="font-semibold">
                        {offer.rating}
                      </span>

                    </div>

                  </div>

                </div>                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  {offer.percent}
                </span>

              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-slate-50 p-5">

                  <div className="flex items-center gap-2 text-slate-500">
                    <Wallet size={18} />
                    <span>Сумма</span>
                  </div>

                  <p className="mt-3 text-xl font-bold">
                    {offer.amount}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={18} />
                    <span>Срок</span>
                  </div>

                  <p className="mt-3 text-xl font-bold">
                    {offer.term}
                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-2xl bg-blue-50 p-5">

                <div className="flex items-center gap-2 text-blue-700">
                  <BadgePercent size={18} />

                  <span className="font-semibold">
                    Первым клиентам доступны предложения со ставкой от 0%
                  </span>

                </div>

              </div>

              <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">
                Оформить заявку
                <ArrowRight size={20} />
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}