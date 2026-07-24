"use client";

import { useState } from "react";

export default function Hero() {
  const [amount, setAmount] = useState(30000);
  const [term, setTerm] = useState(30);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">

        <div>
          <div className="mb-5 inline-block rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
            ⭐ Более 100 финансовых предложений
          </div>

          <h1 className="text-5xl font-black leading-tight text-slate-900">
            Подберите
            <br />
            лучший
            <br />
            финансовый
            <br />
            продукт
          </h1>

          <p className="mt-5 text-slate-600">
            Сравните предложения банков и МФО.
            Получите деньги, карту или кредит за несколько минут.
          </p>

          <button className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white">
            Подобрать продукт →
          </button>
        </div>


        <div className="rounded-3xl border bg-white p-6 shadow-xl">

          <h2 className="text-xl font-bold">
            Калькулятор микрозайма
          </h2>

          <p className="text-sm text-slate-500">
            Выберите сумму и срок
          </p>


          <div className="mt-6">

            <div className="flex justify-between font-bold">
              <span>Сумма займа</span>
              <span className="text-blue-600">
                {amount.toLocaleString()} ₽
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="100000"
              value={amount}
              onChange={(e)=>setAmount(Number(e.target.value))}
              className="mt-3 w-full"
            />

          </div>


          <div className="mt-6">

            <div className="flex justify-between font-bold">
              <span>Срок займа</span>
              <span className="text-blue-600">
                {term} дней
              </span>
            </div>

            <input
              type="range"
              min="7"
              max="365"
              value={term}
              onChange={(e)=>setTerm(Number(e.target.value))}
              className="mt-3 w-full"
            />

          </div>


          <div className="mt-6 space-y-3">

            <input
              placeholder="Имя"
              className="w-full rounded-xl border p-3"
            />

            <input
              placeholder="Фамилия"
              className="w-full rounded-xl border p-3"
            />

            <input
              placeholder="Телефон"
              className="w-full rounded-xl border p-3"
            />

          </div>


          <button className="mt-5 w-full rounded-xl bg-green-600 py-4 font-bold text-white">
            Получить предложения →
          </button>


          <p className="mt-3 text-center text-xs text-slate-400">
            Отправляя заявку, вы соглашаетесь с обработкой персональных данных
          </p>

        </div>

      </div>
    </section>
  );
}