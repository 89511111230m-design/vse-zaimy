import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contacts" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1"><Link href="/" className="text-2xl font-black tracking-tight text-white">ВСЕ ЗАЙМЫ</Link><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Сервис для сравнения финансовых продуктов и подбора подходящих предложений.</p><a href={siteConfig.phoneHref} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-blue-300"><Phone size={17} aria-hidden="true" />{siteConfig.phone}</a></div>
          <div><h2 className="text-sm font-bold text-white">Продукты</h2><ul className="mt-4 space-y-3 text-sm text-slate-400"><li><Link href="/products" className="hover:text-white">Весь каталог</Link></li><li><Link href="/#offers" className="hover:text-white">Новые предложения</Link></li><li><Link href="/#lead-form" className="hover:text-white">Подбор продукта</Link></li></ul></div>
          <div><h2 className="text-sm font-bold text-white">Информация</h2><ul className="mt-4 space-y-3 text-sm text-slate-400"><li><Link href="/privacy" className="hover:text-white">Политика конфиденциальности</Link></li><li><Link href="/personal-data" className="hover:text-white">Обработка персональных данных</Link></li><li><Link href="/terms" className="hover:text-white">Пользовательское соглашение</Link></li></ul></div>
          <div><h2 className="text-sm font-bold text-white">Важно знать</h2><p className="mt-4 text-sm leading-6 text-slate-400">Сервис не является банком, МФО, кредитором или страховщиком. Условия и решения по заявке определяет финансовая организация.</p><Link href="/#lead-form" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-blue-200">Оставить заявку <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} ВСЕ ЗАЙМЫ. Все права защищены.</p><p>Информация на сайте не является индивидуальной финансовой рекомендацией.</p></div>
      </div>
    </footer>
  );
}
