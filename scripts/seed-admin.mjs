import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/seed-admin.mjs <email> <mot-de-passe>");
  process.exit(1);
}

let url = process.env.DATABASE_URL;
if (url) {
  url = url.trim();
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1);
  }
}
if (!url) {
  console.error("DATABASE_URL manquant (définis-le dans l'environnement ou lance avec --env-file)");
  process.exit(1);
}

const sql = neon(url);
const normalizedEmail = email.toLowerCase().trim();
const passwordHash = await bcrypt.hash(password, 12);

// Upsert sur l'email : crée le compte, ou met à jour son mot de passe sans toucher à son rôle.
const [row] = await sql.query(
  "INSERT INTO admins (email, password_hash) VALUES ($1, $2) " +
    "ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, " +
    "reset_token_hash = NULL, reset_token_expiry = NULL " +
    "RETURNING (xmax = 0) AS inserted",
  [normalizedEmail, passwordHash]
);

console.log(`Admin "${normalizedEmail}" ${row.inserted ? "créé" : "mis à jour"} dans Neon.`);
