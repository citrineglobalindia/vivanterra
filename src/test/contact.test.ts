import { describe, it, expect, vi } from "vitest";
import { submitContactEnquiry, type ContactEnquiry } from "@/lib/contact";

const baseValues: ContactEnquiry = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+91 88675 89797",
  scope: "residence",
  budget: "5-10",
  message: "Looking for a 4-bed residence in Sadashiva Nagar.",
};

function jsonResponse(status: number): Response {
  return new Response(JSON.stringify({ ok: status < 400 }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("submitContactEnquiry", () => {
  it("returns a mock success when no endpoint is configured", async () => {
    const fetchImpl = vi.fn();
    const result = await submitContactEnquiry(baseValues, { fetchImpl });
    expect(result).toEqual({ ok: true, mock: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs JSON to the configured endpoint with our payload + metadata", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200));
    const result = await submitContactEnquiry(baseValues, {
      endpoint: "https://hooks.example.com/contact",
      fetchImpl,
    });

    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://hooks.example.com/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });

    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      ...baseValues,
      source: "vivanterra-website",
    });
    expect(typeof body.submittedAt).toBe("string");
    expect(() => new Date(body.submittedAt)).not.toThrow();
  });

  it("returns a server error result on non-2xx responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(500));
    const result = await submitContactEnquiry(baseValues, {
      endpoint: "https://hooks.example.com/contact",
      fetchImpl,
    });
    expect(result).toMatchObject({ ok: false, reason: "server", status: 500 });
  });

  it("returns a network error result on fetch rejection", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const result = await submitContactEnquiry(baseValues, {
      endpoint: "https://hooks.example.com/contact",
      fetchImpl,
    });
    expect(result).toMatchObject({ ok: false, reason: "network" });
  });

  it("returns a timeout error when the request is aborted", async () => {
    const fetchImpl = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      return new Promise((_, reject) => {
        init.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const result = await submitContactEnquiry(baseValues, {
      endpoint: "https://hooks.example.com/contact",
      timeoutMs: 5,
      fetchImpl,
    });
    expect(result).toMatchObject({ ok: false, reason: "timeout" });
  });

  it("short-circuits to success when the honeypot has content", async () => {
    const fetchImpl = vi.fn();
    const result = await submitContactEnquiry(baseValues, {
      endpoint: "https://hooks.example.com/contact",
      honeypot: "https://spam.example.com",
      fetchImpl,
    });
    expect(result).toEqual({ ok: true, mock: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
