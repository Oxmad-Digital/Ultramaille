import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Article from "@/models/Article";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  const article = await Article.findById(id).lean();
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  return NextResponse.json({ success: true, article });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const {
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    coverImagePublicId,
    coverImageAlt,
    category,
    tags,
    status,
    featured,
    favorite,
    publishedAt,
    metaTitle,
    metaDescription,
  } = body;

  await connectDB();
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  if (title !== undefined) {
    if (title.fr !== undefined) article.title.fr = title.fr;
    if (title.en !== undefined) article.title.en = title.en;
  }
  if (slug !== undefined) article.slug = slug;
  if (excerpt !== undefined) {
    if (excerpt.fr !== undefined) article.excerpt.fr = excerpt.fr;
    if (excerpt.en !== undefined) article.excerpt.en = excerpt.en;
  }
  if (content !== undefined) {
    if (content.fr !== undefined) article.content.fr = content.fr;
    if (content.en !== undefined) article.content.en = content.en;
  }
  if (coverImageUrl !== undefined) article.coverImageUrl = coverImageUrl;
  if (coverImagePublicId !== undefined) article.coverImagePublicId = coverImagePublicId;
  if (coverImageAlt !== undefined) article.coverImageAlt = coverImageAlt;
  if (category !== undefined) article.category = category;
  if (tags !== undefined) article.tags = Array.isArray(tags) ? tags : [];
  if (featured !== undefined) article.featured = Boolean(featured);
  if (favorite !== undefined) article.favorite = Boolean(favorite);
  if (metaTitle !== undefined) {
    if (metaTitle.fr !== undefined) article.metaTitle.fr = metaTitle.fr;
    if (metaTitle.en !== undefined) article.metaTitle.en = metaTitle.en;
  }
  if (metaDescription !== undefined) {
    if (metaDescription.fr !== undefined) article.metaDescription.fr = metaDescription.fr;
    if (metaDescription.en !== undefined) article.metaDescription.en = metaDescription.en;
  }

  if (status !== undefined && status !== article.status) {
    article.status = status;
    if (status === "published") {
      article.publishedAt = article.publishedAt ?? new Date();
    } else if (status === "scheduled") {
      article.publishedAt = publishedAt ? new Date(publishedAt) : article.publishedAt;
    } else if (status === "draft") {
      article.publishedAt = null;
    }
  } else if (status === "scheduled" && publishedAt !== undefined) {
    article.publishedAt = publishedAt ? new Date(publishedAt) : null;
  }

  await article.save();
  return NextResponse.json({ success: true, article });
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
  await Article.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
