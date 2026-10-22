import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  slugify,
  toLocalized,
  cleanTags,
  parseDate,
  estimateReadingMinutes,
} from "@/lib/blog";
import {
  badRequest,
  isDuplicateKeyError,
  isForeignKeyError,
  isValidId,
  readJson,
  str,
} from "@/lib/http";
import { isCloudinaryUrl } from "@/lib/cloudinary";
import { publishDueArticles } from "@/lib/publishDueArticles";
import { articles } from "@/lib/repositories/articles";
import { authors } from "@/lib/repositories/authors";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await publishDueArticles();
  const list = await articles.findAll();
  return NextResponse.json({ success: true, articles: list });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await readJson(request);
  if (!body) return badRequest();

  const title = toLocalized(body.title);
  const content = toLocalized(body.content);
  if (!title.fr || !content.fr) {
    return badRequest("Titre et contenu (FR) requis");
  }

  const coverImageUrl = (body.coverImageUrl || null) as string | null;
  if (coverImageUrl !== null && !isCloudinaryUrl(coverImageUrl)) {
    return badRequest("URL de couverture invalide");
  }
  const authorId = (body.authorId || null) as string | null;
  if (authorId !== null && (typeof authorId !== "string" || !isValidId(authorId))) {
    return badRequest("Auteur invalide");
  }
  if (authorId && !(await authors.findById(authorId))) {
    return badRequest("Auteur invalide");
  }

  const isPublished = body.status === "published";
  const isScheduled = body.status === "scheduled";
  const scheduledAt = parseDate(body.publishedAt);
  if (isScheduled && !scheduledAt) {
    return badRequest("Date de publication invalide");
  }

  let slug = slugify(str(body.slug, 200) || title.fr) || `article-${Date.now().toString(36)}`;
  if (await articles.slugExists(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  let article;
  try {
    article = await articles.create({
      title,
      slug,
      excerpt: toLocalized(body.excerpt),
      content,
      coverImageUrl,
      coverImagePublicId: str(body.coverImagePublicId, 300) || null,
      coverImageAlt: str(body.coverImageAlt, 300),
      authorId,
      category: str(body.category, 100),
      tags: cleanTags(body.tags),
      status: isPublished ? "published" : isScheduled ? "scheduled" : "draft",
      featured: Boolean(body.featured),
      favorite: false,
      publishedAt: isPublished ? new Date() : isScheduled ? scheduledAt : null,
      metaTitle: toLocalized(body.metaTitle),
      metaDescription: toLocalized(body.metaDescription),
      readingMinutes: {
        fr: estimateReadingMinutes(content.fr),
        en: estimateReadingMinutes(content.en),
      },
    });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }
    if (isForeignKeyError(err)) return badRequest("Auteur invalide");
    throw err;
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (isPublished) revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ success: true, article }, { status: 201 });
}
