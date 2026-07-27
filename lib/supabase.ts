import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Offer } from "@/lib/catalog";

function getServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getPublishedOffers(): Promise<Offer[]> {
  const supabase = getServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("offers")
    .select(`
      id,
      company,
      product_name,
      category,
      affiliate_url,
      logo,
      description,
      amount_min,
      amount_max,
      term_min,
      term_max,
      rate,
      first_loan,
      credit_limit,
      cashback,
      service_cost,
      features,
      badge,
      priority,
      is_published
    `)
    .eq("is_published", true)
    .order("priority", { ascending: false });

  if (error) {
    console.error("Could not load offers:", error.message);
    return [];
  }

  return (data ?? []).map((offer) => ({
    id: offer.id,
    company: offer.company,
    productName: offer.product_name,
    category: offer.category,
    affiliateUrl: offer.affiliate_url,
    logo: offer.logo,
    description: offer.description,
    amountMin: offer.amount_min,
    amountMax: offer.amount_max,
    termMin: offer.term_min,
    termMax: offer.term_max,
    rate: offer.rate,
    firstLoan: offer.first_loan,
    creditLimit: offer.credit_limit,
    cashback: offer.cashback,
    serviceCost: offer.service_cost,
    features: offer.features,
    badge: offer.badge,
    priority: offer.priority,
    isPublished: offer.is_published,
  }));
}

export async function saveLead(lead: {
  name: string;
  phone: string;
  amount: number | null;
  term: number | null;
  category: string;
  consent: boolean;
}) {
  const supabase = getServerSupabaseClient();

  if (!supabase) {
    return {
      ok: false as const,
      reason: "not-configured" as const,
    };
  }

  const trimmedName = lead.name.trim().replace(/\s+/g, " ");
  const parts = trimmedName.split(" ").filter(Boolean);
  const first_name = parts[0] ?? "";
  const last_name = parts.slice(1).join(" ");

  const { error } = await supabase
    .from("leads")
    .insert({
      first_name,
      last_name,
      phone: lead.phone,
      amount: lead.amount,
      category: lead.category,
      status: "new",
    });

  if (error) {
    console.error("Could not save lead:", error.message);

    return {
      ok: false as const,
      reason: "storage-error" as const,
    };
  }

  return {
    ok: true as const,
  };
}
