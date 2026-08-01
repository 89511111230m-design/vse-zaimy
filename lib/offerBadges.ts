import { FileX, Gift, type LucideIcon, ShieldCheck, Sparkles } from "lucide-react";
import type { Offer } from "@/lib/catalog";

export type OfferBadge = {
  key: string;
  icon: LucideIcon;
  label: string;
  tone: "amber" | "violet" | "blue" | "slate";
};

/**
 * Only surfaces marketing badges that can be derived from data the partner
 * actually provided (first-loan promo text, free-text features/description).
 * There is no real signal in the catalog for things like "popular" or "new"
 * (priority and created_at are uniform across every offer), so those are
 * intentionally not fabricated here.
 */
export function getOfferBadges(offer: Offer): OfferBadge[] {
  const badges: OfferBadge[] = [];

  if (offer.firstLoan?.trim()) {
    badges.push({ key: "first-loan", icon: Gift, label: offer.firstLoan.trim(), tone: "amber" });
  }

  const haystack = [offer.description, ...(offer.features ?? []), ...(offer.additionalFeatures ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("ru-RU");

  if (/без\s+справок|без\s+документ/u.test(haystack)) {
    badges.push({ key: "no-docs", icon: FileX, label: "Без справок", tone: "violet" });
  }

  if (/высок\w*\s+одобрен|без\s+отказ|люб\w*\s+кредитн\w*\s+истор/u.test(haystack)) {
    badges.push({ key: "high-approval", icon: ShieldCheck, label: "Высокое одобрение", tone: "blue" });
  }

  if (offer.badge?.trim()) {
    badges.push({ key: "custom", icon: Sparkles, label: offer.badge.trim(), tone: "slate" });
  }

  return badges;
}

export function hasOfferBadges(offer: Offer): boolean {
  return getOfferBadges(offer).length > 0;
}
