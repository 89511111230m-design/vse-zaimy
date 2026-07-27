import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ВСЕ ЗАЙМЫ — подбор финансовых продуктов",
    template: "%s | ВСЕ ЗАЙМЫ",
  },
  description:
    "Сравнивайте финансовые продукты и оставляйте заявку на подбор подходящих предложений.",
  applicationName: "ВСЕ ЗАЙМЫ",
  keywords: ["микрозаймы", "кредиты", "кредитные карты", "финансовые продукты"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ВСЕ ЗАЙМЫ",
    title: "ВСЕ ЗАЙМЫ — подбор финансовых продуктов",
    description:
      "Сравнивайте финансовые продукты и оставляйте заявку на подбор подходящих предложений.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ВСЕ ЗАЙМЫ — подбор финансовых продуктов",
    description:
      "Сравнивайте финансовые продукты и оставляйте заявку на подбор подходящих предложений.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        telephone: siteConfig.phone,
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: "ru-RU",
      },
    ],
  };

  return (
    <html
      lang="ru"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
