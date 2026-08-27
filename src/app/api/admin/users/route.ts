import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireAdminRole } from "@/lib/requireAdmin";
import Admin from "@/models/Admin";

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
  const password = (body.password || "") as string;
  const role = body.role === "member" ? "member" : "admin";

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères" },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Cet utilisateur existe déjà" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await Admin.create({ email, passwordHash, role });

  return NextResponse.json(
    { success: true, user: { id: user._id.toString(), email: user.email, role: user.role } },
    { status: 201 }
  );
}
