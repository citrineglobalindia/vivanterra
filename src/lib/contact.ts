/**
 * Contact-form submission helper.
 *
 * Posts the enquiry as JSON to the endpoint set in `VITE_CONTACT_ENDPOINT`.
 * Falls back to a console-log "mock send" when no endpoint is configured,
 * so the form is usable in local dev without a backend.
 *
 * The endpoint can be any HTTP collector that accepts JSON — a Vercel /
 * Netlify / Cloudflare function, Formspree, Web3Forms, a Make.com hook,
 * an internal API, etc. Wire it via `.env.local`:
 *
 *     VITE_CONTACT_ENDPOINT=https://hooks.example.com/contact
 *
 * Returns a discriminated union so the caller can show a precise toast.
 */

export type ContactEnquiry = {
  name: string;
  email: string;
  phone?: string;
  scope: "residence" | "investor" | "press" | "career" | "visit";
  budget?: "under-2" | "2-5" | "5-10" | "10-plus";
  message: string;
  /** Slug of the project the enquiry is about, when sent from a detail page. */
  projectSlug?: string;
};

export type SubmitResult =
  | { ok: true; mock?: boolean }
  | {
      ok: false;
      reason: "timeout" | "network" | "server" | "spam";
      message: string;
      status?: number;
    };

export type SubmitOptions = {
  /** Override the endpoint (mostly for tests). */
  endpoint?: string;
  /** Override request timeout in ms (default 15s). */
  timeoutMs?: number;
  /** Honeypot value — if non-empty we treat it as a bot and short-circuit. */
  honeypot?: string;
  /** Injectable fetch (mostly for tests). */
  fetchImpl?: typeof fetch;
};

const DEFAULT_TIMEOUT_MS = 15_000;

const DEFAULT_PRODUCTION_ENDPOINT = "/api/contact";

function resolveEndpoint(override?: string): string | undefined {
  if (override) return override;
  const fromEnv =
    (import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    }).env?.VITE_CONTACT_ENDPOINT;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  // In the browser, default to the same-origin Vercel function. Server-side
  // (tests, SSR) returns undefined so the mock-mode branch runs instead.
  if (typeof window !== "undefined") return DEFAULT_PRODUCTION_ENDPOINT;
  return undefined;
}

export async function submitContactEnquiry(
  values: ContactEnquiry,
  options: SubmitOptions = {},
): Promise<SubmitResult> {
  // Honeypot: a real user can't fill a hidden field. Pretend success so
  // the bot doesn't learn it was caught.
  if (options.honeypot && options.honeypot.trim().length > 0) {
    return { ok: true, mock: true };
  }

  const endpoint = resolveEndpoint(options.endpoint);
  const payload = {
    ...values,
    source: "vivanterra-website",
    submittedAt: new Date().toISOString(),
  };

  if (!endpoint) {
    // eslint-disable-next-line no-console
    console.info("[contact] no VITE_CONTACT_ENDPOINT set; enquiry:", payload);
    return { ok: true, mock: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        ok: false,
        reason: "server",
        status: res.status,
        message: `Server responded with ${res.status}`,
      };
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        ok: false,
        reason: "timeout",
        message: "Request timed out. Please try again.",
      };
    }
    return {
      ok: false,
      reason: "network",
      message:
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
