import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-center"><div><p className="text-sm font-bold text-blue-700">Ошибка 404</p><h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Страница не найдена</h1><p className="mt-5 max-w-md text-slate-600">Возможно, ссылка устарела или страница была перемещена.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"><ArrowLeft size={18} aria-hidden="true" />На главную</Link></div></main>;
}
