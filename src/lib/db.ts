import mongoose from "mongoose";
import { neon, Pool, type NeonQueryFunction, type PoolClient } from "@neondatabase/serverless";

export type Row = Record<string, unknown>;

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL manquant dans les variables d'environnement");
  }
  return url;
}

// Client HTTP créé à la première requête : l'import seul (build) ne doit pas exiger DATABASE_URL.
let httpClient: NeonQueryFunction<false, false> | null = null;

// Requête simple (une instruction) via HTTP : pas de connexion à maintenir.
export async function query<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  httpClient ??= neon(databaseUrl());
  return (await httpClient.query(text, params)) as T[];
}

// Plusieurs instructions atomiques via Pool (WebSocket). Le pool est fermé à la fin :
// en serverless, une connexion WebSocket ne doit pas survivre à la requête.
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: databaseUrl() });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// ---------------------------------------------------------------------------
// Mongoose : temporaire, le temps de la migration. Supprimé au nettoyage final.
// ---------------------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI manquant dans les variables d'environnement");
  }

  if (!cache.promise) {
    // Si la connexion échoue, on oublie la promesse rejetée : sinon toutes les requêtes
    // suivantes de cette instance échoueraient jusqu'au prochain démarrage à froid.
    cache.promise = mongoose.connect(MONGODB_URI).catch((err) => {
      cache.promise = null;
      throw err;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
