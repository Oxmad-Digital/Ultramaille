import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { requireAdminRole } from "@/lib/requireAdmin";
import Admin from "@/models/Admin";
import { sendInvitationEmail } from "@/lib/mailer";

const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET() {
  if (!(await requireAdminRole())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const users = await Admin.find({}).sort({ email: 1 }).lean();

  return NextResponse.json({
    success: true,
    users: users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      role: u.role || "admin",
      invitePending: !!u.invitePending,
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdminRole();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const email = (body.email || "").toLowerCase().trim();
  const role = body.role === "member" ? "member" : "admin";

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Cet utilisateur existe déjà" }, { status: 409 });
  }

  const placeholderPassword = crypto.randomBytes(32).toString("hex");
  const passwordHash = await bcrypt.hash(placeholderPassword, 12);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await Admin.create({
    email,
    passwordHash,
    role,
    resetTokenHash: tokenHash,
    resetTokenExpiry: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
    invitePending: true,
  });

  const origin = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  const inviteUrl = `${origin}/admin/reset-password?token=${rawToken}&invite=1`;

  try {
    await sendInvitationEmail(user.email, inviteUrl, role);
  } catch (err) {
    console.error("Échec de l'envoi de l'email d'invitation", err);
    await Admin.findByIdAndDelete(user._id);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email d'invitation" },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        invitePending: user.invitePending,
      },
    },
    { status: 201 }
  );
}
