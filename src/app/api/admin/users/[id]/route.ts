import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireAdminRole } from "@/lib/requireAdmin";
import Admin from "@/models/Admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminRole();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  await connectDB();

  const user = await Admin.findById(id);
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (body.role !== undefined) {
    const role = body.role === "member" ? "member" : "admin";
    if (role !== "admin" && id === session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas retirer vos propres droits administrateur" },
        { status: 400 }
      );
    }
    if (role !== "admin" && user.role === "admin") {
      const remainingAdmins = await Admin.countDocuments({
        _id: { $ne: id },
        role: { $ne: "member" },
      });
      if (remainingAdmins === 0) {
        return NextResponse.json(
          { error: "Impossible de retirer le dernier administrateur" },
          { status: 400 }
        );
      }
    }
    user.role = role;
  }

  if (body.password) {
    if ((body.password as string).length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }
    user.passwordHash = await bcrypt.hash(body.password, 12);
    user.invitePending = false;
  }

  await user.save();

  return NextResponse.json({
    success: true,
    user: { id: user._id.toString(), email: user.email, role: user.role },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminRole();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await Admin.findById(id);
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (user.role !== "member") {
    const remainingAdmins = await Admin.countDocuments({
      _id: { $ne: id },
      role: { $ne: "member" },
    });
    if (remainingAdmins === 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer le dernier administrateur" },
        { status: 400 }
      );
    }
  }

  await Admin.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
