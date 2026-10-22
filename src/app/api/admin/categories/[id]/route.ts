import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { categories } from "@/lib/repositories/categories";
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

  const category = await categories.findById(id);
  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }

  const existing = await categories.findByName(name, id);
  if (existing) {
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
  }

  // Renomme aussi les articles de l'ancienne catégorie, dans la même transaction.
  const renamed = await categories.rename(category, name);

  return NextResponse.json({ success: true, category: renamed });
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

  // Retire aussi la catégorie des articles, dans la même transaction.
  await categories.deleteById(id);

  return NextResponse.json({ success: true });
}
