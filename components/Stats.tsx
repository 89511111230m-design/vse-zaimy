"use client";

import { useEffect, useState } from "react";

export default function Stats() {
  const [count, setCount] = useState(12450);

  useEffect(() => {
    const random = Math.floor(
      Math.random() * (12999 - 12450) + 12450
    );

    setCount(random);
  }, []);

  return (
    <section className="bg-blue-600 py-10">
      <div className="mx-auto max-w-5xl px-6">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="text-3xl font-black text-blue-600">
              {count.toLocaleString()}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              предложений подобрано пользователям
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="text-3xl font-black text-blue-600">
              100+
            </div>
            <p className="mt-2 text-sm text-slate-600">
              финансовых продуктов
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="text-3xl font-black text-blue-600">
              24/7
            </div>
            <p className="mt-2 text-sm text-slate-600">
              доступ к подбору
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}