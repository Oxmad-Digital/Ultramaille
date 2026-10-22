import { NextResponse } from "next/server";
import { rateLimits } from "@/lib/repositories/rateLimits";

type Limit = { limit: number; windowMs: number };

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// Fenêtre fixe partagée entre instances (compteur stocké dans Postgres).
// Renvoie true si la requête est autorisée.
export async function rateLimit(bucket: string, id: string, { limit, windowMs }: Limit) {
  const count = await rateLimits.hit(`${bucket}:${id}`, windowMs);
  return count <= limit;
}

// Variante en mémoire, propre à chaque instance : sans coût base de données, donc
// adaptée aux endpoints très fréquents (suivi de pages vues). Best-effort seulement.
const memoryHits = new Map<string, { count: number; resetAt: number }>();

export function memoryRateLimit(bucket: string, id: string, { limit, windowMs }: Limit) {
  const now = Date.now();
  const key = `${bucket}:${id}`;

  if (memoryHits.size > 5000) {
    for (const [k, v] of memoryHits) if (v.resetAt <= now) memoryHits.delete(k);
  }

  const entry = memoryHits.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export function tooManyRequests() {
  return NextResponse.json(
    { error: "Trop de requêtes, réessayez plus tard." },
    { status: 429, headers: { "Retry-After": "900" } }
  );
}
