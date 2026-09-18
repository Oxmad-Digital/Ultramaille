export type LocalizedText = {
  fr: string;
  en: string;
};

const DIACRITICS_RE = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function estimateReadingMinutes(content: string) {
  const text = content.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const ARTICLE_STATUSES = ["draft", "scheduled", "published"] as const;

// { fr, en } de chaînes à partir d'une entrée non fiable.
export function toLocalized(value: unknown): LocalizedText {
  const o = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    fr: typeof o.fr === "string" ? o.fr : "",
    en: typeof o.en === "string" ? o.en : "",
  };
}

// Applique uniquement les langues fournies (mise à jour partielle).
export function applyLocalized(target: LocalizedText, value: unknown) {
  if (!value || typeof value !== "object") return;
  const o = value as Record<string, unknown>;
  if (typeof o.fr === "string") target.fr = o.fr;
  if (typeof o.en === "string") target.en = o.en;
}

export function cleanTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim().slice(0, 50))
    .filter(Boolean)
    .slice(0, 30);
}

export function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
