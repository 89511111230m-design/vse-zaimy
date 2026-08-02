const EVENT_NAME = "vse-zaimy:lead-catalog-filter";
const STORAGE_KEY = "vse-zaimy:lead-catalog-category";
const STORAGE_TTL_MS = 15000;

type LeadCatalogDetail = { category: string };

/**
 * Bridges a successful lead-form submission to the offer catalog, so the
 * user lands on filtered results instead of staying on the form.
 *
 * If a Catalog is already mounted on the current page (products page,
 * category pages), it is notified in place via a custom event - no
 * navigation needed. Otherwise (e.g. the homepage, which has no inline
 * Catalog) the chosen category is stashed in sessionStorage so the Catalog
 * can pick it up right after it mounts on the page the caller navigates to.
 *
 * Returns true when an already-mounted Catalog was notified directly.
 */
export function notifyCatalogOfLeadCategory(category: string): boolean {
  if (typeof window === "undefined") return false;

  if (document.getElementById("catalog-cards")) {
    window.dispatchEvent(new CustomEvent<LeadCatalogDetail>(EVENT_NAME, { detail: { category } }));
    return true;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ category, ts: Date.now() }));
  } catch {
    // Ignore storage failures (private browsing, quota, etc.) - navigation still happens.
  }
  return false;
}

/** Reads and clears a pending lead category left by a cross-page redirect. */
export function consumePendingLeadCategory(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);

    const parsed = JSON.parse(raw) as { category?: unknown; ts?: unknown };
    if (typeof parsed.category !== "string" || typeof parsed.ts !== "number") return null;
    if (Date.now() - parsed.ts > STORAGE_TTL_MS) return null;
    return parsed.category;
  } catch {
    return null;
  }
}

/** Subscribes to same-page lead-category notifications. Returns an unsubscribe function. */
export function onLeadCatalogFilter(handler: (category: string) => void) {
  if (typeof window === "undefined") return () => {};

  const listener = (event: Event) => {
    const detail = (event as CustomEvent<LeadCatalogDetail>).detail;
    if (detail?.category) handler(detail.category);
  };

  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
