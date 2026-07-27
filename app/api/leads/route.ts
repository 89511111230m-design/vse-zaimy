import { NextResponse } from "next/server";
import { notifyLeadWebhook } from "@/lib/lead-webhook";
import { saveLead } from "@/lib/supabase";

export const runtime = "nodejs";

const namePattern = /^[\p{L}\p{M}\s'-]{2,80}$/u;

function normalizePhone(value: unknown) {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  const normalized = digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8")) ? `+7${digits.slice(1)}` : `+${digits}`;
  return /^\+[1-9]\d{9,14}$/.test(normalized) ? normalized : null;
}

function parseBoundedInteger(value: unknown, min: number, max: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try { payload = await request.json(); } catch { return NextResponse.json({ message: "Некорректный формат запроса." }, { status: 400 }); }

  const name = typeof payload.name === "string" ? payload.name.trim().replace(/\s+/g, " ") : "";
  const phone = normalizePhone(payload.phone);
  const amount = parseBoundedInteger(payload.amount, 1000, 10000000);
  const term = parseBoundedInteger(payload.term, 1, 3650);
  const category = typeof payload.category === "string" ? payload.category : "general";

  if (!namePattern.test(name) || !phone || amount === null || term === null || payload.consent !== true || category.length > 120) {
    return NextResponse.json({ message: "Проверьте заполнение формы и подтвердите согласие на обработку данных." }, { status: 400 });
  }

  const result = await saveLead({ name, phone, amount, term, category, consent: true });
  if (!result.ok) {
    const message = result.reason === "not-configured" ? "Приём заявок временно недоступен. Попробуйте позже." : "Не удалось сохранить заявку. Повторите попытку позже.";
    return NextResponse.json({ message }, { status: 503 });
  }

  return NextResponse.json({ message: "Заявка принята." }, { status: 201 });
}
