import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Article from "@/models/Article";

const DIACRITICS_RE = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, articles });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { title, excerpt, content, coverImageUrl, coverImagePublicId, status } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
  }

  await connectDB();

  let slug = slugify(body.slug || title);
  const existing = await Article.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const isPublished = status === "published";

  const article = await Article.create({
    title,
    slug,
    excerpt: excerpt ?? "",
    content,
    coverImageUrl: coverImageUrl ?? null,
    coverImagePublicId: coverImagePublicId ?? null,
    status: isPublished ? "published" : "draft",
    publishedAt: isPublished ? new Date() : null,
  });

  return NextResponse.json({ success: true, article }, { status: 201 });
}
