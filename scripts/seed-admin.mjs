import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/seed-admin.mjs <email> <mot-de-passe>");
  process.exit(1);
}

let uri = process.env.MONGODB_URI;
if (uri) {
  uri = uri.trim();
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1);
  }
}
if (!uri) {
  console.error("MONGODB_URI manquant (lance avec --env-file=.env.local)");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

await mongoose.connect(uri);

const passwordHash = await bcrypt.hash(password, 12);
await Admin.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { email: email.toLowerCase().trim(), passwordHash, resetTokenHash: null, resetTokenExpiry: null },
  { upsert: true }
);

console.log(`Admin "${email}" créé/mis à jour dans MongoDB.`);
await mongoose.disconnect();
