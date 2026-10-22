import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import { categories } from "@/lib/repositories/categories";
import { articles } from "@/lib/repositories/articles";
import { badRequest, readJson, str } from "@/lib/http";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const [list, countMap] = await Promise.all([categories.findAll(), articles.countByCategory()]);

  return NextResponse.json({
    success: true,
    categories: list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      articleCount: countMap.get(c.name) ?? 0,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await readJson(request);
  if (!body) return badRequest();
  const name = str(body.name, 100);
  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  const existing = await categories.findByName(name);
  if (existing) {
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
  }

  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (await categories.slugExists(slug)) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  const category = await categories.create({ name, slug });
  return NextResponse.json({ success: true, category }, { status: 201 });
}
