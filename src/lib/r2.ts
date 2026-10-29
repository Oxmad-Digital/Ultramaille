import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 via son API compatible S3. Le client est créé à la première
// utilisation : un build sans variables R2 ne doit pas échouer à l'import.
let client: S3Client | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} manquant dans les variables d'environnement`);
  }
  return value;
}

export function getR2Client() {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }
  return client;
}

export function getR2Bucket() {
  return requireEnv("R2_BUCKET");
}

// Base publique des fichiers (ex. https://media.ultramaille.com), sans slash final.
export function getR2PublicUrl() {
  return requireEnv("R2_PUBLIC_URL").replace(/\/+$/, "");
}

export function r2PublicUrlFor(key: string) {
  return `${getR2PublicUrl()}/${key}`;
}
