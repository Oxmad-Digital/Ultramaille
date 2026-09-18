import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RateLimit from "@/models/RateLimit";

type Limit = { limit: number; windowMs: number };

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// Fenêtre fixe partagée entre instances (compteur stocké dans MongoDB).
// Renvoie true si la requête est autorisée.
export async function rateLimit(bucket: string, id: string, { limit, windowMs }: Limit) {
  await connectDB();
  const key = `${bucket}:${id}`;
  const now = new Date();

  const current = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { returnDocument: "after" }
  ).lean();
  if (current) return current.count <= limit;

  // Aucune fenêtre active : on en ouvre une (ou on réinitialise une fenêtre expirée
  // pas encore purgée par le TTL).
  await RateLimit.findOneAndUpdate(
    { key },
    { $set: { count: 1, expiresAt: new Date(now.getTime() + windowMs) } },
    { upsert: true }
  );
  return true;
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
