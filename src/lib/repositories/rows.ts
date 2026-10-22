// Conversion des lignes Postgres vers la forme des anciens documents Mongoose (.lean()).

export function text(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function textOrNull(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

export function date(v: unknown): Date {
  return v instanceof Date ? v : new Date(v as string);
}

export function dateOrNull(v: unknown): Date | null {
  return v === null || v === undefined ? null : date(v);
}

// count(*) revient en texte (bigint).
export function count(v: unknown): number {
  return Number(v ?? 0);
}

// Le front et les routes lisent tantôt _id, tantôt id : on fournit les deux.
export function ids(v: unknown) {
  const id = String(v);
  return { _id: id, id };
}
