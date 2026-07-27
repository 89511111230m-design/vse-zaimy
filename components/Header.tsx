"use client";

import Link from "next/link";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { title: "Каталог", href: "/products" },
    { title: "Как это работает", href: "/#how-it-works" },
    { title: "Отзывы", href: "/#reviews" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/80 bg-white/85 shadow-lg shadow-slate-950/[0.04] backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">

        {/* Логотип */}

        <Link href="/" className="flex flex-col">

          <span className="text-2xl font-black tracking-[-0.04em] text-blue-700">
            ВСЕ ЗАЙМЫ
          </span>

          <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Финансовый маркетплейс
          </span>

        </Link>

        {/* Меню ПК */}

        <nav aria-label="Основная навигация" className="hidden items-center gap-6 xl:flex">

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-700 transition duration-200 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
              {item.title}
            </Link>
          ))}

        </nav>

        {/* Правая часть */}

        <div className="hidden items-center gap-5 lg:flex">

          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            <Phone size={18} />
            {siteConfig.phone}
          </a>

          <Link
            href="/#lead-form"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            Подобрать
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

        </div>

        {/* Кнопка мобильного меню */}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>      {/* Мобильное меню */}

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-100 bg-white/95 shadow-xl shadow-slate-950/5 backdrop-blur lg:hidden">

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
              href={siteConfig.phoneHref}
              className="mt-6 flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-4 font-semibold text-slate-700"
            >
              <Phone size={20} />
              {siteConfig.phone}
            </a>

            <Link
              href="/#lead-form"
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
