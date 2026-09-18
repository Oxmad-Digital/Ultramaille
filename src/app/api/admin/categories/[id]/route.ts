import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Category from "@/models/Category";
import Article from "@/models/Article";
import { badRequest, invalidId, isValidId, readJson, str } from "@/lib/http";

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
  const name = str(body.name, 100);
  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  await connectDB();

  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }

  const existing = await Category.findOne({ name, _id: { $ne: id } });
  if (existing) {
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
  }

  const oldName = category.name;
  category.name = name;
  await category.save();

  if (oldName !== name) {
    await Article.updateMany({ category: oldName }, { category: name });
  }

  return NextResponse.json({ success: true, category });
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

  const category = await Category.findByIdAndDelete(id);
  if (category) {
    await Article.updateMany({ category: category.name }, { category: "" });
  }

  return NextResponse.json({ success: true });
}
