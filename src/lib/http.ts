import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Corps JSON d'une requête, ou null s'il est absent, invalide ou n'est pas un objet.
// Évite les erreurs 500 sur un corps malformé.
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function badRequest(message = "Requête invalide") {
  return NextResponse.json({ error: message }, { status: 400 });
}

// Chaîne trimée et tronquée ; toute valeur non-string devient "".
export function str(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isValidId(id: string) {
  return mongoose.isValidObjectId(id);
}

export function invalidId() {
  return NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

// Erreur Mongo "clé dupliquée" (index unique).
export function isDuplicateKeyError(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}
