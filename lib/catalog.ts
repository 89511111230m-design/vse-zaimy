export type Offer = {
  id: string;
  company: string;
  productName: string | null;
  category: string;
  affiliateUrl: string;
  logo: string | null;
  description: string | null;
  amountMin: number | null;
  amountMax: number | null;
  termMin: number | null;
  termMax: number | null;
  rate: string | null;
  firstLoan: string | null;
  creditLimit: string | null;
  cashback: string | null;
  serviceCost: string | null;
  features: string[] | null;
  badge: string | null;
  priority: number;
  isPublished: boolean;
};

export type OfferCategory = {
  name: string;
  slug: string;
};

export function categorySlug(category: string) {
  return category
    .trim()
    .toLocaleLowerCase("ru-RU")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "drugoe";
}

export function offerCategories(offers: Offer[]): OfferCategory[] {
  return [...new Set(offers.map((offer) => offer.category.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "ru"))
    .map((name) => ({ name, slug: categorySlug(name) }));
}
