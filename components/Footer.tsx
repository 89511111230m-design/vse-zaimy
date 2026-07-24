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
                Главная
              </li>

              <li>
                Финансовые продукты
              </li>

              <li>
                Отзывы
              </li>

              <li>
                Контакты
              </li>

            </ul>
          </div>


          <div>
            <h4 className="font-bold">
              Информация
            </h4>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">

              <li>
                Политика конфиденциальности
              </li>

              <li>
                Обработка персональных данных
              </li>

              <li>
                Пользовательское соглашение
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
              Сервис предоставляет информационные
              услуги по подбору финансовых предложений.
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