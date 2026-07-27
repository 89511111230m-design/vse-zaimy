import { siteConfig } from "@/lib/site";

type LeadPayload = {
  name: string;
  phone: string;
  amount: number | null;
  term: number | null;
  category: string;
};

export async function notifyLeadWebhook(lead: LeadPayload) {
  const url = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        source: siteConfig.name,
        createdAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Lead webhook failed", error instanceof Error ? error.message : error);
  }
}
