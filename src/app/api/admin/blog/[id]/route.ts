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
  const { title, slug, excerpt, content, coverImageUrl, coverImagePublicId, status } = body;

  await connectDB();
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  if (title !== undefined) article.title = title;
  if (slug !== undefined) article.slug = slug;
  if (excerpt !== undefined) article.excerpt = excerpt;
  if (content !== undefined) article.content = content;
  if (coverImageUrl !== undefined) article.coverImageUrl = coverImageUrl;
  if (coverImagePublicId !== undefined) article.coverImagePublicId = coverImagePublicId;

  if (status !== undefined && status !== article.status) {
    article.status = status;
    if (status === "published" && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    if (status === "draft") {
      article.publishedAt = null;
    }
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
