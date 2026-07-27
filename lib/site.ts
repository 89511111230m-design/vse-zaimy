export const siteConfig = {
  name: "ВСЕ ЗАЙМЫ",
  description:
    "Сервис для сравнения финансовых продуктов и подбора подходящих предложений.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://vse-zaimy.ru",
  phone: "+7 951 111-12-30",
  phoneHref: "tel:+79511111230",
} as const;
