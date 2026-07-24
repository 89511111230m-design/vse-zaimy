import {
  Wallet,
  CreditCard,
  Landmark,
  Building2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function Categories() {
  const items = [
    {
      icon: Wallet,
      title: "Микрозаймы",
      text: "Подбор среди 40+ МФО",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: CreditCard,
      title: "Кредитные карты",
      text: "Лучшие предложения банков",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: CreditCard,
      title: "Дебетовые карты",
      text: "Карты с кэшбэком и процентом на остаток",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: Landmark,
      title: "Кредиты",
      text: "Потребительские кредиты онлайн",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Building2,
      title: "РКО",
      text: "Расчетные счета для бизнеса",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: ShieldCheck,
      title: "Страхование",
      text: "ОСАГО, КАСКО и другие продукты",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-4xl font-bold text-slate-900">
          Финансовые продукты
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>

                <div className="mt-6 flex items-center font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                  Подробнее
                  <ArrowRight className="ml-2" size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}