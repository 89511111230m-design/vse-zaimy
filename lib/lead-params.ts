export const LEAD_PARAMS_STORAGE_KEY = "vse-zaimy:lead-params";

export type LeadParams = {
  amount: number;
  term: number;
};

export function saveLeadParams(params: LeadParams) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LEAD_PARAMS_STORAGE_KEY, JSON.stringify(params));
}

export function readLeadParams(): LeadParams | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(LEAD_PARAMS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as LeadParams;
    if (
      typeof parsed.amount === "number" &&
      parsed.amount >= 1000 &&
      parsed.amount <= 10000000 &&
      typeof parsed.term === "number" &&
      parsed.term >= 1 &&
      parsed.term <= 3650
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearLeadParams() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LEAD_PARAMS_STORAGE_KEY);
}
