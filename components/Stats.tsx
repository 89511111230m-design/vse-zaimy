export default function Stats({ categoryCount = 0 }: { categoryCount?: number }) {
  return (
    <section aria-label="Преимущества сервиса" className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-white/30 bg-white/95 p-5 text-center shadow-lg shadow-blue-950/10">
            <div className="text-lg font-black text-blue-700">
              По параметрам
            </div>
            <p className="mt-2 text-sm text-slate-600">
              подбирайте продукт под свою задачу
            </p>
          </div>


          <div className="rounded-2xl border border-white/30 bg-white/95 p-5 text-center shadow-lg shadow-blue-950/10">
            <div className="text-lg font-black text-blue-700">
              {categoryCount > 0 ? categoryCount : "Разные"}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {categoryCount > 0 ? "финансовых направлений" : "финансовые направления"}
            </p>
          </div>


          <div className="rounded-2xl border border-white/30 bg-white/95 p-5 text-center shadow-lg shadow-blue-950/10">
            <div className="text-lg font-black text-blue-700">
              Понятные условия
            </div>
            <p className="mt-2 text-sm text-slate-600">
              изучайте ключевые параметры заранее
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
