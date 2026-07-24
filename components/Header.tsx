"use client";

import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      title: "Микрозаймы",
      href: "/microloans",
    },
    {
      title: "Кредитные карты",
      href: "/credit-cards",
    },
    {
      title: "Дебетовые карты",
      href: "/debit-cards",
    },
    {
      title: "Кредиты",
      href: "/loans",
    },
    {
      title: "РКО",
      href: "/rko",
    },
    {
      title: "Страхование",
      href: "/insurance",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Логотип */}

        <Link href="/" className="flex flex-col">

          <span className="text-2xl font-black tracking-tight text-blue-700">
            ВСЕ ЗАЙМЫ
          </span>

          <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Финансовый маркетплейс
          </span>

        </Link>

        {/* Меню ПК */}

        <nav className="hidden items-center gap-8 lg:flex">

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-slate-700 transition hover:text-blue-600"
            >
              {item.title}
            </Link>
          ))}

        </nav>

        {/* Правая часть */}

        <div className="hidden items-center gap-6 lg:flex">

          <a
            href="tel:+79511111230"
            className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600"
          >
            <Phone size={18} />
            +7 951 111-12-30
          </a>

          <Link
            href="/microloans"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Подобрать
          </Link>

        </div>

        {/* Кнопка мобильного меню */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>      {/* Мобильное меню */}

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">

          <nav className="flex flex-col px-6 py-6">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
              >
                {item.title}
              </Link>
            ))}

            <a
              href="tel:+79511111230"
              className="mt-6 flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-4 font-semibold text-slate-700"
            >
              <Phone size={20} />
              +7 951 111-12-30
            </a>

            <Link
              href="/microloans"
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-4 text-center font-bold text-white transition hover:bg-blue-700"
            >
              Подобрать продукт
            </Link>

          </nav>

        </div>
      )}

    </header>
  );
}