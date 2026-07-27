import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = { title: "Согласие на обработку персональных данных", robots: { index: false, follow: true } };

export default function PersonalDataPage() {
  return (
    <><Header /><main className="bg-white"><article className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20">

      <p className="text-sm font-bold text-blue-700">Редакция от 26.07.2026</p><h1 className="mt-3 text-4xl font-black tracking-tight">
        Согласие на обработку персональных данных
      </h1>

      <div className="mt-8 space-y-5 leading-7 text-slate-700">

        <p>
          Пользователь дает согласие на обработку
          персональных данных при отправке заявки.
        </p>

        <p>
          Обработка включает сбор, хранение,
          использование и передачу данных партнерам
          для подбора финансовых предложений.
        </p>

        <p>Пользователь подтверждает, что действует добровольно, предоставил достоверные сведения и вправе отозвать согласие в любой момент. Отзыв согласия не влияет на законность обработки, выполненной до его отзыва.</p>

      </div>

    </article></main><Footer /></>
  );
}
