"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { clearLeadParams, readLeadParams } from "@/lib/lead-params";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type FormStatus = "idle" | "pending" | "success" | "error";

const defaultValues = { name: "", phone: "", amount: "30000", term: "30", category: "general", consent: false };
const SUCCESS_REDIRECT_MS = 5000;

export default function LeadForm({ defaultCategory = "general", categories = [] }: { defaultCategory?: string; categories?: string[] }) {
  const [values, setValues] = useState(() => {
    const params = readLeadParams();
    if (params) {
      clearLeadParams();
      return {
        ...defaultValues,
        category: defaultCategory,
        amount: String(params.amount),
        term: String(params.term),
      };
    }

    return { ...defaultValues, category: defaultCategory };
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(SUCCESS_REDIRECT_MS / 1000);

  useEffect(() => {
    if (status !== "success") return;

    setSecondsLeft(SUCCESS_REDIRECT_MS / 1000);
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    const redirect = window.setTimeout(() => {
      window.location.href = "/products";
    }, SUCCESS_REDIRECT_MS);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(redirect);
    };
  }, [status]);

  const updateValue = (field: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, amount: Number(values.amount), term: Number(values.term) }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Не удалось отправить заявку.");

      setStatus("success");
      setMessage("Подбираем лучшие предложения из каталога партнеров.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
    }
  }

  if (status === "pending") {
    return (
      <section id="lead-form" className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <div className="rounded-[2rem] border border-white/60 bg-white p-10 text-center shadow-2xl shadow-blue-950/30 sm:p-14">
            <LoaderCircle className="mx-auto animate-spin text-blue-600" size={44} aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-black text-slate-900">Отправляем заявку</h2>
            <p className="mt-3 leading-7 text-slate-600">Проверяем данные и передаём их в защищённое хранилище. Это не означает одобрение финансового продукта.</p>
            <div className="mx-auto mt-8 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" /></div>
          </div>
        </div>
      </section>
    );
  }

  if (status === "success") {
    return (
      <section id="lead-form" className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <div className="rounded-[2rem] border border-white/60 bg-white p-8 text-center shadow-2xl shadow-blue-950/30 sm:p-12">
            <CheckCircle2 className="mx-auto text-green-600" size={48} aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-black text-slate-900">Заявка успешно принята</h2>
            <p className="mt-3 leading-7 text-slate-600">{message}</p>
            <p className="mt-6 text-sm font-semibold text-blue-700">До показа результатов осталось: <span className="tabular-nums">{secondsLeft}</span> сек.</p>
            <div className="mx-auto mt-8 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100"><div className="h-full w-full animate-pulse rounded-full bg-blue-600" /></div>
            <Link href="/products" className="mt-8 inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Открыть каталог сразу</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-2xl shadow-blue-950/35 lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10 lg:p-12"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/25 blur-2xl" /><div className="relative"><span className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-100">Персональный подбор</span><h2 className="mt-7 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Расскажите, что вы ищете</h2><p className="mt-5 leading-7 text-slate-300">Заполните короткую форму. Мы используем только сведения, необходимые для обработки заявки.</p><ul className="mt-10 space-y-5 text-sm leading-6 text-slate-200"><li className="flex gap-3"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-400" aria-hidden="true" />Вы сами выбираете подходящее предложение.</li><li className="flex gap-3"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-400" aria-hidden="true" />Условия не скрыты в форме заявки.</li><li className="flex gap-3"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green-400" aria-hidden="true" />Сервис не принимает решение о выдаче денег.</li></ul></div></div>
          <div className="p-8 sm:p-10 lg:p-12"><h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Получить подборку</h2><p className="mt-3 text-sm text-slate-600">Поля со звёздочкой обязательны.</p>
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-800">Имя <span className="text-red-600">*</span></span><input required minLength={2} maxLength={80} value={values.name} onChange={(event) => updateValue("name", event.target.value)} name="name" autoComplete="given-name" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Как к вам обращаться" /></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-800">Телефон <span className="text-red-600">*</span></span><input required type="tel" inputMode="tel" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} name="phone" autoComplete="tel" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="+7 900 000-00-00" /></label>
              <label><span className="mb-2 block text-sm font-bold text-slate-800">Сумма, ₽</span><input required type="number" min="1000" max="10000000" step="1000" value={values.amount} onChange={(event) => updateValue("amount", event.target.value)} name="amount" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100" /></label>
              <label><span className="mb-2 block text-sm font-bold text-slate-800">Срок, дней</span><input required type="number" min="1" max="3650" value={values.term} onChange={(event) => updateValue("term", event.target.value)} name="term" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100" /></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-800">Интересующий продукт</span><select value={values.category} onChange={(event) => updateValue("category", event.target.value)} name="category" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"><option value="general">Подобрать подходящий продукт</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
              <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-5 text-slate-600 transition hover:border-blue-100 hover:bg-blue-50/40"><input required type="checkbox" checked={values.consent} onChange={(event) => updateValue("consent", event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" /><span>Я даю согласие на обработку персональных данных в соответствии с <Link href="/personal-data" className="font-semibold text-blue-700 underline underline-offset-2">согласием</Link> и <Link href="/privacy" className="font-semibold text-blue-700 underline underline-offset-2">политикой конфиденциальности</Link>. <span className="text-red-600">*</span></span></label>
              {status === "error" && <p className="sm:col-span-2 rounded-xl bg-red-50 p-4 text-sm leading-5 text-red-700" role="alert">{message}</p>}
              <button className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"><Send size={19} aria-hidden="true" /> Отправить заявку</button>
              <p className="sm:col-span-2 text-center text-xs leading-5 text-slate-400">Нажимая кнопку, вы подтверждаете достоверность предоставленных данных.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
