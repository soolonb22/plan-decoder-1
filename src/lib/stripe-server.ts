/** Stripe REST helper. Secret stays on the server — never a VITE_ key. */

const API = "https://api.stripe.com/v1";

export function stripeSecret() {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export function stripeConfigured() {
  return Boolean(stripeSecret());
}

export async function stripeForm<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<T> {
  const key = stripeSecret();
  if (!key) throw new Error("Payments are not connected yet.");
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    body.set(k, String(v));
  }
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message || `Stripe error ${res.status}`);
  }
  return json;
}

export async function stripeGet<T>(path: string): Promise<T> {
  const key = stripeSecret();
  if (!key) throw new Error("Payments are not connected yet.");
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message || `Stripe error ${res.status}`);
  }
  return json;
}

export type StripeSession = {
  id: string;
  mode: string;
  status: string;
  payment_status: string;
  customer?: string | null;
  subscription?: string | null;
  client_reference_id?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  amount_total?: number | null;
  metadata?: Record<string, string>;
};

export function publicAppOrigin(raw: string) {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.origin;
  } catch {
    return null;
  }
}
