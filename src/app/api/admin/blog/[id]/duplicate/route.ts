import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import Article from "@/models/Article";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();

  const source = await Article.findById(id).lean();
  if (!source) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  let slug = slugify(`${source.slug}-copie`);
  if (await Article.findOne({ slug })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const copy = await Article.create({
    title: { fr: `${source.title.fr} (copie)`, en: source.title.en ? `${source.title.en} (copy)` : "" },
    slug,
    excerpt: source.excerpt,
    content: source.content,
    coverImageUrl: source.coverImageUrl,
    coverImagePublicId: source.coverImagePublicId,
    coverImageAlt: source.coverImageAlt,
    category: source.category,
    tags: source.tags,
    status: "draft",
    featured: false,
    favorite: false,
    publishedAt: null,
    metaTitle: source.metaTitle,
    metaDescription: source.metaDescription,
  });

  return NextResponse.json({ success: true, article: copy }, { status: 201 });
}
