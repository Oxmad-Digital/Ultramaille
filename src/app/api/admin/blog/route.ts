import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import { publishDueArticles } from "@/lib/publishDueArticles";
import Article from "@/models/Article";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  await publishDueArticles();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, articles });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    excerpt,
    content,
    coverImageUrl,
    coverImagePublicId,
    coverImageAlt,
    authorId,
    category,
    tags,
    status,
    featured,
    publishedAt,
    metaTitle,
    metaDescription,
  } = body;

  if (!title?.fr || !content?.fr) {
    return NextResponse.json({ error: "Titre et contenu (FR) requis" }, { status: 400 });
  }

  await connectDB();

  let slug = slugify(body.slug || title.fr);
  const existing = await Article.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const isPublished = status === "published";
  const isScheduled = status === "scheduled";

  const article = await Article.create({
    title: { fr: title.fr ?? "", en: title.en ?? "" },
    slug,
    excerpt: { fr: excerpt?.fr ?? "", en: excerpt?.en ?? "" },
    content: { fr: content.fr ?? "", en: content.en ?? "" },
    coverImageUrl: coverImageUrl ?? null,
    coverImagePublicId: coverImagePublicId ?? null,
    coverImageAlt: coverImageAlt ?? "",
    authorId: authorId || null,
    category: category ?? "",
    tags: Array.isArray(tags) ? tags : [],
    status: isPublished ? "published" : isScheduled ? "scheduled" : "draft",
    featured: Boolean(featured),
    publishedAt: isPublished ? new Date() : isScheduled && publishedAt ? new Date(publishedAt) : null,
    metaTitle: { fr: metaTitle?.fr ?? "", en: metaTitle?.en ?? "" },
    metaDescription: { fr: metaDescription?.fr ?? "", en: metaDescription?.en ?? "" },
  });

  return NextResponse.json({ success: true, article }, { status: 201 });
}
