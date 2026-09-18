import { NextResponse, after } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

const GENERIC_MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.";

export async function POST(request: Request) {
  const allowed = await rateLimit("forgot-ip", getClientIp(request.headers), {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) return tooManyRequests();

  const body = await request.json().catch(() => null);
  const normalizedEmail = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  await connectDB();
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (admin) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    admin.resetTokenHash = tokenHash;
    admin.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await admin.save();

    const origin = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const resetUrl = `${origin}/admin/reset-password?token=${rawToken}`;

    // Après la réponse : l'appel à Resend (plusieurs centaines de ms) ne doit pas
    // allonger le temps de réponse des seuls comptes existants.
    after(async () => {
      try {
        await sendPasswordResetEmail(admin.email, resetUrl);
      } catch (err) {
        console.error("Échec de l'envoi de l'email de réinitialisation", err);
      }
    });
  }

  return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
}
