import type { MetadataRoute } from "next";
import { offerCategories } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";
import { getPublishedOffers } from "@/lib/supabase";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = offerCategories(await getPublishedOffers());
  const routes = ["", "/products", ...categories.map((category) => `/${category.slug}`)];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : route === "/products" ? 0.8 : 0.7,
  }));
}