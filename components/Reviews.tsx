const reviews = [
  {
    name: "Алексей",
    text: "Удобный сервис, все предложения собраны в одном месте.",
  },
  {
    name: "Марина",
    text: "Быстро разобралась, нашла подходящий вариант.",
  },
  {
    name: "Дмитрий",
    text: "Понятный сайт, ничего лишнего.",
  },
  {
    name: "Ольга",
    text: "Удобно сравнивать разные финансовые продукты.",
  },
  {
    name: "Сергей",
    text: "Сэкономил время на поиске предложений.",
  },
  {
    name: "Анна",
    text: "Все работает просто и понятно.",
  },
  {
    name: "Иван",
    text: "Хорошая подборка вариантов.",
  },
  {
    name: "Елена",
    text: "Удобно пользоваться с телефона.",
  },
  {
    name: "Максим",
    text: "Быстро нашел нужную информацию.",
  },
  {
    name: "Наталья",
    text: "Понравился простой процесс оформления.",
  },
  {
    name: "Роман",
    text: "Хороший сервис для поиска финансовых решений.",
  },
  {
    name: "Виктория",
    text: "Все понятно даже без опыта.",
  },
];

export default function Reviews() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-3xl font-black text-slate-900">
          Отзывы пользователей
        </h2>

        <p className="mt-3 text-center text-slate-600">
          Мнения пользователей о сервисе
        </p>


        <div className="mt-10 grid gap-6 md:grid-cols-3">

          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-3xl border border-slate-200 p-6"
            >

              <div className="text-xl text-yellow-500">
                ★★★★★
              </div>

              <p className="mt-4 text-slate-700">
                "{review.text}"
              </p>

              <div className="mt-5 font-bold text-slate-900">
                {review.name}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}