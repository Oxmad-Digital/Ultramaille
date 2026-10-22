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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidId(id: string) {
  return UUID_RE.test(id);
}

export function invalidId() {
  return NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

// Violation de contrainte unique : 23505 (Postgres). 11000 (Mongo) n'est accepté que le
// temps de la coexistence des deux bases, à retirer au nettoyage.
export function isDuplicateKeyError(err: unknown) {
  if (typeof err !== "object" || err === null) return false;
  const code = (err as { code?: unknown }).code;
  return code === "23505" || code === 11000;
}

// Violation de clé étrangère Postgres (ex. auteur supprimé entre la vérification et l'écriture).
export function isForeignKeyError(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === "23503";
}
