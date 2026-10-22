// Migration des données MongoDB -> Neon (PostgreSQL), à lancer après db/schema.sql.
//
//   npx tsx scripts/migrate-mongo-to-neon.ts --dry-run   (aucune écriture)
//   npx tsx scripts/migrate-mongo-to-neon.ts             (migration réelle)
//
// Variables d'environnement : MONGODB_URI (lecture) et DATABASE_URL (écriture).
// Idempotent : chaque ligne est upsertée sur legacy_mongo_id. Une transaction par table.
// Les rate limits ne sont pas migrés.

import mongoose from "mongoose";
import { Pool, neonConfig, type PoolClient } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = WebSocket;

const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 200;
const ARTICLE_BATCH_SIZE = 25; // contenus volumineux

type Doc = Record<string, unknown> & { _id: unknown };
type Value = string | number | boolean | Date | string[] | null;
type Converted = { row: Value[] } | { skip: string };

type TableReport = {
  table: string;
  collection: string | null;
  mongoCount: number;
  inserted: number;
  updated: number;
  skipped: { id: string; reason: string }[];
  neonCount: number | null;
};

type Orphan = { articleId: string; slug: string; authorId: string };

// ---------------------------------------------------------------------------
// Conversion des valeurs Mongo
// ---------------------------------------------------------------------------

const idOf = (doc: Doc) => String(doc._id);

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function strOrNull(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function int(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function date(v: unknown): Date | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

// createdAt absent : on retombe sur la date encodée dans l'ObjectId.
function createdAt(doc: Doc): Date {
  const fromId = (doc._id as { getTimestamp?: () => Date } | null)?.getTimestamp?.();
  return date(doc.createdAt) ?? date(fromId) ?? new Date();
}

function updatedAt(doc: Doc): Date {
  return date(doc.updatedAt) ?? createdAt(doc);
}

// Accepte aussi une ancienne valeur string non localisée.
function localized(v: unknown): { fr: string; en: string } {
  if (typeof v === "string") return { fr: v, en: "" };
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return { fr: str(o.fr), en: str(o.en) };
}

function tags(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((t): t is string => typeof t === "string") : [];
}

function readingMinutes(v: unknown): string | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.fr !== "number" || typeof o.en !== "number") return null;
  return JSON.stringify({ fr: o.fr, en: o.en });
}

// ---------------------------------------------------------------------------
// Définition des tables (ordre = ordre de migration)
// ---------------------------------------------------------------------------

type TableSpec = {
  table: string;
  collections: string[]; // noms candidats côté Mongo
  columns: string[]; // legacy_mongo_id toujours en premier
  hasUpdatedAtTrigger: boolean;
  batchSize?: number;
  convert: (doc: Doc) => Converted;
};

// Rempli avant la migration des articles : legacy_mongo_id auteur -> uuid Neon.
const authorIds = new Map<string, string>();
const orphans: Orphan[] = [];

const TABLES: TableSpec[] = [
  {
    table: "categories",
    collections: ["categories"],
    columns: ["legacy_mongo_id", "name", "slug", "created_at", "updated_at"],
    hasUpdatedAtTrigger: true,
    convert(doc) {
      const name = str(doc.name).trim();
      const slug = str(doc.slug).trim().toLowerCase();
      if (!name) return { skip: "name manquant" };
      if (!slug) return { skip: "slug manquant" };
      return { row: [idOf(doc), name, slug, createdAt(doc), updatedAt(doc)] };
    },
  },
  {
    table: "authors",
    collections: ["authors"],
    columns: [
      "legacy_mongo_id", "name", "slug", "email", "bio", "avatar_url", "avatar_public_id",
      "created_at", "updated_at",
    ],
    hasUpdatedAtTrigger: true,
    convert(doc) {
      const name = str(doc.name).trim();
      const slug = str(doc.slug).trim().toLowerCase();
      if (!name) return { skip: "name manquant" };
      if (!slug) return { skip: "slug manquant" };
      return {
        row: [
          idOf(doc), name, slug, str(doc.email).trim(), str(doc.bio),
          strOrNull(doc.avatarUrl), strOrNull(doc.avatarPublicId),
          createdAt(doc), updatedAt(doc),
        ],
      };
    },
  },
  {
    table: "admins",
    collections: ["admins"],
    columns: [
      "legacy_mongo_id", "email", "password_hash", "role", "reset_token_hash",
      "reset_token_expiry", "invite_pending", "created_at", "updated_at",
    ],
    hasUpdatedAtTrigger: true,
    convert(doc) {
      const email = str(doc.email).trim().toLowerCase();
      // Hash copié tel quel, jamais affiché.
      const passwordHash = str(doc.passwordHash);
      if (!email) return { skip: "email manquant" };
      if (!passwordHash) return { skip: "passwordHash manquant" };
      const role = doc.role === undefined || doc.role === null ? "admin" : doc.role;
      if (role !== "admin" && role !== "member") return { skip: "role invalide" };
      return {
        row: [
          idOf(doc), email, passwordHash, role, strOrNull(doc.resetTokenHash),
          date(doc.resetTokenExpiry), bool(doc.invitePending), createdAt(doc), updatedAt(doc),
        ],
      };
    },
  },
  {
    table: "media",
    collections: ["media", "medias"],
    columns: [
      "legacy_mongo_id", "url", "public_id", "filename", "alt", "format", "bytes", "width",
      "height", "created_at", "updated_at",
    ],
    hasUpdatedAtTrigger: true,
    convert(doc) {
      const url = str(doc.url);
      const publicId = str(doc.publicId);
      if (!url) return { skip: "url manquant" };
      if (!publicId) return { skip: "publicId manquant" };
      return {
        row: [
          idOf(doc), url, publicId, str(doc.filename), str(doc.alt), str(doc.format),
          int(doc.bytes), int(doc.width), int(doc.height), createdAt(doc), updatedAt(doc),
        ],
      };
    },
  },
  {
    table: "articles",
    collections: ["articles"],
    columns: [
      "legacy_mongo_id", "slug", "title_fr", "title_en", "excerpt_fr", "excerpt_en",
      "content_fr", "content_en", "meta_title_fr", "meta_title_en", "meta_description_fr",
      "meta_description_en", "cover_image_url", "cover_image_public_id", "cover_image_alt",
      "author_id", "category", "tags", "status", "featured", "favorite", "published_at",
      "views", "reading_minutes", "created_at", "updated_at",
    ],
    hasUpdatedAtTrigger: true,
    batchSize: ARTICLE_BATCH_SIZE,
    convert(doc) {
      const slug = str(doc.slug).trim().toLowerCase();
      if (!slug) return { skip: "slug manquant" };
      const status = doc.status === undefined || doc.status === null ? "draft" : doc.status;
      if (status !== "draft" && status !== "scheduled" && status !== "published") {
        return { skip: "status invalide" };
      }

      let authorId: string | null = null;
      if (doc.authorId !== undefined && doc.authorId !== null && doc.authorId !== "") {
        const legacy = String(doc.authorId);
        authorId = authorIds.get(legacy) ?? null;
        if (!authorId) orphans.push({ articleId: idOf(doc), slug, authorId: legacy });
      }

      const title = localized(doc.title);
      const excerpt = localized(doc.excerpt);
      const content = localized(doc.content);
      const metaTitle = localized(doc.metaTitle);
      const metaDescription = localized(doc.metaDescription);

      return {
        row: [
          idOf(doc), slug, title.fr, title.en, excerpt.fr, excerpt.en, content.fr, content.en,
          metaTitle.fr, metaTitle.en, metaDescription.fr, metaDescription.en,
          strOrNull(doc.coverImageUrl), strOrNull(doc.coverImagePublicId),
          str(doc.coverImageAlt), authorId, str(doc.category).trim(), tags(doc.tags), status,
          bool(doc.featured), bool(doc.favorite), date(doc.publishedAt), int(doc.views),
          readingMinutes(doc.readingMinutes), createdAt(doc), updatedAt(doc),
        ],
      };
    },
  },
  {
    table: "page_views",
    collections: ["pageviews"],
    columns: [
      "legacy_mongo_id", "day", "path", "referrer", "device_type", "country", "duration",
      "visitor_hash", "created_at",
    ],
    hasUpdatedAtTrigger: false,
    convert(doc) {
      const day = str(doc.day);
      const path = str(doc.path);
      const visitorHash = str(doc.visitorHash);
      if (!day) return { skip: "day manquant" };
      if (!path) return { skip: "path manquant" };
      if (!visitorHash) return { skip: "visitorHash manquant" };
      const duration =
        typeof doc.duration === "number" && Number.isFinite(doc.duration) ? doc.duration : null;
      return {
        row: [
          idOf(doc), day, path, str(doc.referrer), str(doc.deviceType, "desktop"),
          str(doc.country), duration, visitorHash, createdAt(doc),
        ],
      };
    },
  },
  {
    table: "settings",
    collections: ["settings"],
    columns: [
      "legacy_mongo_id", "key", "maintenance_mode", "maintenance_message", "created_at",
      "updated_at",
    ],
    hasUpdatedAtTrigger: true,
    convert(doc) {
      return {
        row: [
          idOf(doc), str(doc.key, "site") || "site", bool(doc.maintenanceMode),
          str(doc.maintenanceMessage).trim(), createdAt(doc), updatedAt(doc),
        ],
      };
    },
  },
];

// ---------------------------------------------------------------------------
// Écriture Neon
// ---------------------------------------------------------------------------

// INSERT multi-lignes, upsert sur legacy_mongo_id. Renvoie [insérées, mises à jour].
async function upsertBatch(client: PoolClient, spec: TableSpec, rows: Value[][]) {
  const params: Value[] = [];
  const tuples = rows.map((row) => {
    const placeholders = row.map((value) => {
      params.push(value);
      return `$${params.length}`;
    });
    return `(${placeholders.join(", ")})`;
  });
  const updates = spec.columns
    .filter((c) => c !== "legacy_mongo_id")
    .map((c) => `${c} = EXCLUDED.${c}`)
    .join(", ");

  const sql =
    `INSERT INTO ${spec.table} (${spec.columns.join(", ")}) VALUES ${tuples.join(", ")} ` +
    `ON CONFLICT (legacy_mongo_id) DO UPDATE SET ${updates} ` +
    `RETURNING (xmax = 0) AS inserted`;

  const result = await client.query<{ inserted: boolean }>(sql, params);
  const inserted = result.rows.filter((r) => r.inserted).length;
  return [inserted, result.rows.length - inserted] as const;
}

async function loadAuthorIds(pool: Pool) {
  const { rows } = await pool.query<{ id: string; legacy_mongo_id: string }>(
    "SELECT id, legacy_mongo_id FROM authors WHERE legacy_mongo_id IS NOT NULL"
  );
  for (const r of rows) authorIds.set(r.legacy_mongo_id, r.id);
}

// ---------------------------------------------------------------------------
// Migration d'une table
// ---------------------------------------------------------------------------

async function migrateTable(
  db: mongoose.mongo.Db,
  existing: Set<string>,
  pool: Pool | null,
  spec: TableSpec
): Promise<TableReport> {
  const report: TableReport = {
    table: spec.table,
    collection: spec.collections.find((c) => existing.has(c)) ?? null,
    mongoCount: 0,
    inserted: 0,
    updated: 0,
    skipped: [],
    neonCount: null,
  };

  if (!report.collection) {
    console.warn(`  ! collection introuvable (${spec.collections.join(" / ")}), table ignorée`);
    return report;
  }

  const cursor = db.collection(report.collection).find({}).batchSize(500);
  const client = pool ? await pool.connect() : null;
  const batchSize = spec.batchSize ?? BATCH_SIZE;
  let batch: Value[][] = [];

  const flush = async () => {
    if (client && batch.length > 0) {
      const [inserted, updated] = await upsertBatch(client, spec, batch);
      report.inserted += inserted;
      report.updated += updated;
    }
    batch = [];
  };

  try {
    if (client) {
      await client.query("BEGIN");
      // Conserve les updated_at d'origine lors d'une ré-exécution (le trigger les écraserait).
      if (spec.hasUpdatedAtTrigger) {
        await client.query(`ALTER TABLE ${spec.table} DISABLE TRIGGER ${spec.table}_set_updated_at`);
      }
    }

    for await (const raw of cursor) {
      const doc = raw as Doc;
      report.mongoCount++;
      const converted = spec.convert(doc);
      if ("skip" in converted) {
        report.skipped.push({ id: idOf(doc), reason: converted.skip });
        continue;
      }
      batch.push(converted.row);
      if (batch.length >= batchSize) await flush();
    }
    await flush();

    if (client) {
      if (spec.hasUpdatedAtTrigger) {
        await client.query(`ALTER TABLE ${spec.table} ENABLE TRIGGER ${spec.table}_set_updated_at`);
      }
      await client.query("COMMIT");
      const { rows } = await client.query<{ n: string }>(`SELECT count(*) AS n FROM ${spec.table}`);
      report.neonCount = Number(rows[0].n);
    }
  } catch (err) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client?.release();
    await cursor.close();
  }

  return report;
}

// ---------------------------------------------------------------------------
// Rapport
// ---------------------------------------------------------------------------

function printReport(reports: TableReport[]) {
  console.log(`\n===== Rapport ${DRY_RUN ? "(DRY-RUN, aucune écriture)" : ""} =====\n`);
  console.table(
    reports.map((r) => ({
      table: r.table,
      collection: r.collection ?? "(absente)",
      mongo: r.mongoCount,
      [DRY_RUN ? "à écrire" : "insérées"]: DRY_RUN
        ? r.mongoCount - r.skipped.length
        : r.inserted,
      ...(DRY_RUN ? {} : { "mises à jour": r.updated }),
      ignorés: r.skipped.length,
      ...(DRY_RUN ? {} : { "lignes Neon": r.neonCount ?? "-" }),
    }))
  );

  for (const r of reports) {
    if (r.skipped.length === 0) continue;
    console.log(`\nDocuments ignorés dans ${r.table} :`);
    for (const s of r.skipped) console.log(`  - ${s.id} : ${s.reason}`);
  }

  if (orphans.length > 0) {
    console.log("\nArticles dont l'auteur est introuvable (author_id mis à NULL) :");
    for (const o of orphans) {
      console.log(`  - article ${o.articleId} (${o.slug}) -> auteur ${o.authorId}`);
    }
  } else {
    console.log("\nAucun author_id orphelin.");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  const databaseUrl = process.env.DATABASE_URL;
  if (!mongoUri) throw new Error("MONGODB_URI n'est pas défini");
  if (!DRY_RUN && !databaseUrl) throw new Error("DATABASE_URL n'est pas défini");

  console.log(DRY_RUN ? "Mode DRY-RUN : aucune écriture dans Neon." : "Mode RÉEL : écriture dans Neon.");

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  if (!db) throw new Error("Connexion MongoDB indisponible");
  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));

  const pool = DRY_RUN ? null : new Pool({ connectionString: databaseUrl });
  const reports: TableReport[] = [];

  try {
    for (const spec of TABLES) {
      if (spec.table === "articles") {
        if (pool) {
          await loadAuthorIds(pool);
        } else {
          // Dry-run : on simule la correspondance avec les auteurs présents dans Mongo.
          const authorsCollection = existing.has("authors") ? db.collection("authors") : null;
          const ids = authorsCollection
            ? await authorsCollection.find({}, { projection: { _id: 1 } }).toArray()
            : [];
          for (const a of ids) authorIds.set(String(a._id), String(a._id));
        }
      }

      console.log(`\n> ${spec.table}`);
      const report = await migrateTable(db, existing, pool, spec);
      console.log(
        `  ${report.mongoCount} documents, ${report.skipped.length} ignorés` +
          (DRY_RUN ? "" : `, ${report.inserted} insérés, ${report.updated} mis à jour`)
      );
      reports.push(report);
    }
  } finally {
    printReport(reports);
    await pool?.end();
    await mongoose.disconnect();
  }
}

main().catch((err: unknown) => {
  // Message seulement : jamais de dump des lignes (hash de mots de passe).
  console.error("\nÉchec de la migration :", err instanceof Error ? err.message : err);
  process.exit(1);
});
