import mongoose from "mongoose";

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
