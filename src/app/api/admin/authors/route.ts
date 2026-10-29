import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import { authors } from "@/lib/repositories/authors";
import { badRequest, readJson, str } from "@/lib/http";
import { isAllowedImageUrl } from "@/lib/imageUrl";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const list = await authors.findAll();

  return NextResponse.json({
    success: true,
    authors: list.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      email: a.email,
      bio: a.bio,
      avatarUrl: a.avatarUrl,
      avatarPublicId: a.avatarPublicId,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await readJson(request);
  if (!body) return badRequest();
  const name = str(body.name, 120);
  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }
  if (body.avatarUrl && !isAllowedImageUrl(body.avatarUrl)) {
    return badRequest("URL d'avatar invalide");
  }

  const existing = await authors.findByName(name);
  if (existing) {
    return NextResponse.json({ error: "Cet auteur existe déjà" }, { status: 409 });
  }

  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (await authors.slugExists(slug)) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  const author = await authors.create({
    name,
    slug,
    email: str(body.email, 254),
    bio: str(body.bio, 2000),
    avatarUrl: (body.avatarUrl as string) || null,
    avatarPublicId: str(body.avatarPublicId, 300) || null,
  });

  return NextResponse.json({ success: true, author }, { status: 201 });
}
