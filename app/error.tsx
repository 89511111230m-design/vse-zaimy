"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-center"><div><p className="text-sm font-bold text-blue-700">Временная ошибка</p><h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Не удалось загрузить страницу</h1><p className="mt-5 max-w-md text-slate-600">Попробуйте обновить страницу. Если проблема повторится, вернитесь на главную.</p><div className="mt-8 flex justify-center gap-3"><button type="button" onClick={reset} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700">Повторить</button><Link href="/" className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-white">На главную</Link></div></div></main>;
}
