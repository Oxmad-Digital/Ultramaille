import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Author from "@/models/Author";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  await connectDB();

  const author = await Author.findById(id);
  if (!author) {
    return NextResponse.json({ error: "Auteur introuvable" }, { status: 404 });
  }

  const existing = await Author.findOne({ name, _id: { $ne: id } });
  if (existing) {
    return NextResponse.json({ error: "Cet auteur existe déjà" }, { status: 409 });
  }

  author.name = name;
  author.email = (body.email ?? author.email).trim();
  author.bio = (body.bio ?? author.bio).trim();
  if (body.avatarUrl !== undefined) author.avatarUrl = body.avatarUrl;
  if (body.avatarPublicId !== undefined) author.avatarPublicId = body.avatarPublicId;
  await author.save();

  return NextResponse.json({ success: true, author });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  await Author.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
