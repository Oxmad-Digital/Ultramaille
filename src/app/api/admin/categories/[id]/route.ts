import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Category from "@/models/Category";
import Article from "@/models/Article";

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
  await connectDB();

  const category = await Category.findByIdAndDelete(id);
  if (category) {
    await Article.updateMany({ category: category.name }, { category: "" });
  }

  return NextResponse.json({ success: true });
}
