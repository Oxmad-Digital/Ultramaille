import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Author from "@/models/Author";
import { badRequest, invalidId, isValidId, readJson, str } from "@/lib/http";
import { isCloudinaryUrl } from "@/lib/cloudinary";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidId(id)) return invalidId();
  const body = await readJson(request);
  if (!body) return badRequest();
  const name = str(body.name, 120);
  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }
  if (body.avatarUrl && !isCloudinaryUrl(body.avatarUrl)) {
    return badRequest("URL d'avatar invalide");
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
  if (body.email !== undefined) author.email = str(body.email, 254);
  if (body.bio !== undefined) author.bio = str(body.bio, 2000);
  if (body.avatarUrl !== undefined) author.avatarUrl = body.avatarUrl || null;
  if (body.avatarPublicId !== undefined) author.avatarPublicId = str(body.avatarPublicId, 300) || null;
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
  if (!isValidId(id)) return invalidId();
  await connectDB();
  await Author.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
