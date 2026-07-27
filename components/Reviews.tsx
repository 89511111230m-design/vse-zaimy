import { Quote, Star } from "lucide-react";

const reviews = [
  "Удобно, что основные параметры собраны в одном месте. Можно спокойно сравнить варианты и не торопиться с выбором.",
  "Понравилась понятная структура: быстро разобралась, чем отличаются продукты и на что обратить внимание в условиях.",
  "Ничего лишнего: выбрал направление, указал параметры и получил понятный следующий шаг без навязчивых обещаний.",
];

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Мнение о сервисе</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Отзывы пользователей</h2></div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">{reviews.map((review) => <article key={review} className="group relative rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/8"><Quote className="absolute right-6 top-6 text-blue-100 transition group-hover:text-blue-200" size={42} aria-hidden="true" /><div className="flex gap-1 text-amber-400" aria-label="Оценка пять из пяти">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}</div><p className="relative mt-6 min-h-28 text-[15px] leading-7 text-slate-700">«{review}»</p></article>)}</div>
      </div>
    </section>
  );
}
