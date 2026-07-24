"use client";

import { useState } from "react";
import { Calculator, CheckCircle, ArrowRight } from "lucide-react";

export default function Hero() {
  const [amount, setAmount] = useState(30000);
  const [days, setDays] = useState(30);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2">

        {/* Левая колонка */}
        <div>

          <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            ⭐ Более 100 финансовых предложений
          </span>

          <h1 className="mt-8 text-6xl font-black leading-[1.05] tracking-tight text-slate-900">
            Подберите лучший
            <br />
            финансовый продукт
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-8 text-slate-600">
            Сравните предложения банков и МФО.
            Получите деньги, карту или кредит
            всего за несколько минут.
          </p>

          <button className="mt-10 flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl">
            Подобрать продукт
            <ArrowRight size={22} />
          </button>

          <div className="mt-12 space-y-5">

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={22} />
              <span className="text-slate-700">
                Бесплатный подбор финансовых продуктов
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={22} />
              <span className="text-slate-700">
                Только проверенные банки и МФО
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={22} />
              <span className="text-slate-700">
                Решение за несколько минут
              </span>
            </div>

          </div>

        </div>

        {/* Правая колонка */}

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <Calculator className="text-blue-600" size={24} />
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Калькулятор микрозайма
              </h2>

              <p className="text-slate-500">
                Выберите сумму и срок
              </p>

            </div>

          </div>

          <div className="mt-10">            <div className="flex items-center justify-between">

              <span className="text-lg font-semibold text-slate-700">
                Сумма займа
              </span>

              <span className="text-3xl font-black text-blue-600">
                {amount.toLocaleString("ru-RU")} ₽
              </span>

            </div>

            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-5 w-full accent-blue-600"
            />

          </div>

          <div className="mt-10">

            <div className="flex items-center justify-between">

              <span className="text-lg font-semibold text-slate-700">
                Срок займа
              </span>

              <span className="text-3xl font-black text-blue-600">
                {days} дней
              </span>

            </div>

            <input
              type="range"
              min={5}
              max={365}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-5 w-full accent-blue-600"
            />

          </div>

          <div className="mt-10 rounded-3xl bg-slate-50 p-6">

            <div className="flex items-center justify-between border-b border-slate-200 pb-4">

              <span className="text-slate-500">
                Сумма
              </span>

              <span className="font-bold">
                {amount.toLocaleString("ru-RU")} ₽
              </span>

            </div>

            <div className="mt-4 flex items-center justify-between border-b border-slate-200 pb-4">

              <span className="text-slate-500">
                Срок
              </span>

              <span className="font-bold">
                {days} дней
              </span>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <span className="text-slate-500">
                Ставка
              </span>

              <span className="font-bold text-green-600">
                от 0%
              </span>

            </div>

          </div>

          <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-5 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-green-700">
            Получить предложения
            <ArrowRight size={22} />
          </button>

          <p className="mt-6 text-center text-sm leading-6 text-slate-500">
            Отправляя заявку, вы соглашаетесь с условиями обработки
            персональных данных и политикой конфиденциальности.
          </p>

        </div>

      </div>
    </section>
  );
}