import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { admins } from "@/lib/repositories/admins";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const allowed = await rateLimit("reset-ip", getClientIp(request.headers), {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) return tooManyRequests();

  const body = await request.json().catch(() => null);
  const token = body?.token;
  const password = body?.password;

  if (typeof token !== "string" || typeof password !== "string" || !token || !password) {
    return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 }
    );
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Expiration comparée côté Postgres (timestamptz > now()).
  const admin = await admins.findByValidResetToken(tokenHash);

  if (!admin) {
    return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
  }

  admin.passwordHash = await bcrypt.hash(password, 12);
  admin.resetTokenHash = null;
  admin.resetTokenExpiry = null;
  admin.invitePending = false;
  await admins.save(admin);

  return NextResponse.json({ success: true });
}
