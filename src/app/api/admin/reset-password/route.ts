import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
  }

  if ((password as string).length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 }
    );
  }

  await connectDB();
  const tokenHash = crypto.createHash("sha256").update(token as string).digest("hex");

  const admin = await Admin.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!admin) {
    return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
  }

  admin.passwordHash = await bcrypt.hash(password as string, 12);
  admin.resetTokenHash = null;
  admin.resetTokenExpiry = null;
  await admin.save();

  return NextResponse.json({ success: true });
}
