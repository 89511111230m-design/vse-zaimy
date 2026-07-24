import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <h3 className="text-2xl font-black">
              ВСЕ ЗАЙМЫ
            </h3>

            <p className="mt-4 text-sm text-slate-400">
              Сервис подбора финансовых предложений
              от партнерских организаций.
            </p>
          </div>


          <div>
            <h4 className="font-bold">
              Разделы
            </h4>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">

              <li>
                <Link href="/" className="hover:text-white">
                  Главная
                </Link>
              </li>

              <li>
                <Link href="/products" className="hover:text-white">
                  Финансовые продукты
                </Link>
              </li>

              <li>
                <Link href="/#reviews" className="hover:text-white">
                  Отзывы
                </Link>
              </li>

              <li>
                <Link href="/#contacts" className="hover:text-white">
                  Контакты
                </Link>
              </li>

            </ul>
          </div>


          <div>
            <h4 className="font-bold">
              Информация
            </h4>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">

              <li>
                <Link href="/privacy" className="hover:text-white">
                  Политика конфиденциальности
                </Link>
              </li>

              <li>
                <Link href="/personal-data" className="hover:text-white">
                  Обработка персональных данных
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-white">
                  Пользовательское соглашение
                </Link>
              </li>

            </ul>
          </div>


          <div>
            <h4 className="font-bold">
              Важно
            </h4>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              ВСЕ ЗАЙМЫ не является банком,
              МФО или кредитной организацией.
              Сервис предоставляет информационные услуги
              по подбору финансовых предложений.
            </p>
          </div>

        </div>


        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          © 2026 ВСЕ ЗАЙМЫ. Все права защищены.
        </div>


      </div>

    </footer>
  );
}