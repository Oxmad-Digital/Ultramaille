import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { requireAdminRole } from "@/lib/requireAdmin";
import Admin from "@/models/Admin";
import { sendInvitationEmail } from "@/lib/mailer";

const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminRole();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();

  const user = await Admin.findById(id);
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }
  if (!user.invitePending) {
    return NextResponse.json(
      { error: "Cet utilisateur a déjà activé son compte" },
      { status: 400 }
    );
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetTokenHash = tokenHash;
  user.resetTokenExpiry = new Date(Date.now() + INVITE_TOKEN_TTL_MS);
  await user.save();

  const origin = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  const inviteUrl = `${origin}/admin/reset-password?token=${rawToken}&invite=1`;

  try {
    await sendInvitationEmail(user.email, inviteUrl, user.role);
  } catch (err) {
    console.error("Échec de l'envoi de l'email d'invitation", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email d'invitation" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
