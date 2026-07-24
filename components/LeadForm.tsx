"use client";

import { useState } from "react";

export default function LeadForm() {
  const [loading, setLoading] = useState(false);

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      window.location.href = "/offers";
    }, 15000);
  }

  return (
    <section className="bg-blue-600 py-16">
      <div className="mx-auto max-w-5xl px-6">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          {!loading ? (
            <>
              <h2 className="text-center text-3xl font-bold text-slate-900">
                Получите подборку финансовых предложений
              </h2>

              <p className="mt-3 text-center text-slate-600">
                Заполните форму и мы подберем подходящие варианты
              </p>


              <form
                onSubmit={submitForm}
                className="mt-8 grid gap-4 md:grid-cols-2"
              >

                <input
                  required
                  placeholder="Имя"
                  className="rounded-xl border p-4"
                />

                <input
                  required
                  placeholder="Фамилия"
                  className="rounded-xl border p-4"
                />

                <input
                  required
                  placeholder="Телефон"
                  className="rounded-xl border p-4"
                />

                <input
                  required
                  placeholder="Сумма займа"
                  className="rounded-xl border p-4"
                />


                <button
                  className="md:col-span-2 rounded-xl bg-blue-600 p-4 font-bold text-white hover:bg-blue-700"
                >
                  Получить предложения
                </button>

              </form>
            </>
          ) : (

            <div className="py-10 text-center">

              <h2 className="text-3xl font-bold text-slate-900">
                Подбираем предложения...
              </h2>

              <p className="mt-4 text-slate-600">
                Проверяем доступные варианты для вас
              </p>

              <div className="mt-8 text-5xl font-bold text-blue-600">
                15
              </div>

            </div>

          )}

        </div>

      </div>
    </section>
  );
}