import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import { articles } from "@/lib/repositories/articles";
import { invalidId, isDuplicateKeyError, isValidId } from "@/lib/http";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  if (!isValidId(id)) return invalidId();

  const source = await articles.findById(id);
  if (!source) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  let slug = slugify(`${source.slug}-copie`);
  if (await articles.slugExists(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // Copie de tous les champs ; la copie repart en brouillon, non publiée, à 0 vue.
  let copy;
  try {
    copy = await articles.create({
      title: { fr: `${source.title.fr} (copie)`, en: source.title.en ? `${source.title.en} (copy)` : "" },
      slug,
      excerpt: source.excerpt,
      content: source.content,
      coverImageUrl: source.coverImageUrl,
      coverImagePublicId: source.coverImagePublicId,
      coverImageAlt: source.coverImageAlt,
      authorId: source.authorId,
      category: source.category,
      tags: source.tags,
      status: "draft",
      featured: false,
      favorite: false,
      publishedAt: null,
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      readingMinutes: source.readingMinutes,
    });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({ success: true, article: copy }, { status: 201 });
}
