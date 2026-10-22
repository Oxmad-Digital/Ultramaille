import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { requireAdminRole } from "@/lib/requireAdmin";
import { admins } from "@/lib/repositories/admins";
import { sendInvitationEmail } from "@/lib/mailer";
import { badRequest, isDuplicateKeyError, readJson, str } from "@/lib/http";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET() {
  if (!(await requireAdminRole())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const users = await admins.findAll();

  return NextResponse.json({
    success: true,
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      invitePending: u.invitePending,
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdminRole();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await readJson(request);
  if (!body) return badRequest();
  const email = str(body.email, 254).toLowerCase();
  const role = body.role === "member" ? "member" : "admin";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const existing = await admins.findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Cet utilisateur existe déjà" }, { status: 409 });
  }

  const placeholderPassword = crypto.randomBytes(32).toString("hex");
  const passwordHash = await bcrypt.hash(placeholderPassword, 12);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  let user;
  try {
    user = await admins.create({
      email,
      passwordHash,
      role,
      resetTokenHash: tokenHash,
      resetTokenExpiry: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
      invitePending: true,
    });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Cet utilisateur existe déjà" }, { status: 409 });
    }
    throw err;
  }

  const origin = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  const inviteUrl = `${origin}/admin/reset-password?token=${rawToken}&invite=1`;

  try {
    await sendInvitationEmail(user.email, inviteUrl, role);
  } catch (err) {
    console.error("Échec de l'envoi de l'email d'invitation", err);
    await admins.deleteById(user.id);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email d'invitation" },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        invitePending: user.invitePending,
      },
    },
    { status: 201 }
  );
}
