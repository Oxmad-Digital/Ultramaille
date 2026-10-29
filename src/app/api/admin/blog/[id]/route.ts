import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { articles, type ArticleStatus } from "@/lib/repositories/articles";
import { authors } from "@/lib/repositories/authors";
import {
  ARTICLE_STATUSES,
  slugify,
  applyLocalized,
  cleanTags,
  parseDate,
  estimateReadingMinutes,
} from "@/lib/blog";
import {
  badRequest,
  invalidId,
  isDuplicateKeyError,
  isForeignKeyError,
  isValidId,
  readJson,
  str,
} from "@/lib/http";
import { isAllowedImageUrl } from "@/lib/imageUrl";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  if (!isValidId(id)) return invalidId();
  const article = await articles.findById(id);
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
  if (!isValidId(id)) return invalidId();
  const body = await readJson(request);
  if (!body) return badRequest();

  if (
    body.status !== undefined &&
    !ARTICLE_STATUSES.includes(body.status as (typeof ARTICLE_STATUSES)[number])
  ) {
    return badRequest("Statut invalide");
  }
  if (body.coverImageUrl && !isAllowedImageUrl(body.coverImageUrl)) {
    return badRequest("URL de couverture invalide");
  }
  if (body.authorId && (typeof body.authorId !== "string" || !isValidId(body.authorId))) {
    return badRequest("Auteur invalide");
  }
  if (body.publishedAt && !parseDate(body.publishedAt)) {
    return badRequest("Date de publication invalide");
  }
  if (body.slug !== undefined && (typeof body.slug !== "string" || !slugify(body.slug))) {
    return badRequest("Slug invalide");
  }

  const article = await articles.findById(id);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  const previousSlug = article.slug;

  if (body.slug !== undefined) {
    const slug = slugify(body.slug as string);
    if (slug !== article.slug) {
      if (await articles.slugExists(slug, id)) {
        return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
      }
      article.slug = slug;
    }
  }

  applyLocalized(article.title, body.title);
  applyLocalized(article.excerpt, body.excerpt);
  applyLocalized(article.content, body.content);
  applyLocalized(article.metaTitle, body.metaTitle);
  applyLocalized(article.metaDescription, body.metaDescription);
  if (body.content !== undefined) {
    article.readingMinutes = {
      fr: estimateReadingMinutes(article.content.fr),
      en: estimateReadingMinutes(article.content.en),
    };
  }

  if (body.coverImageUrl !== undefined) {
    article.coverImageUrl = (body.coverImageUrl || null) as string | null;
  }
  if (body.coverImagePublicId !== undefined) {
    article.coverImagePublicId = str(body.coverImagePublicId, 300) || null;
  }
  if (body.coverImageAlt !== undefined) article.coverImageAlt = str(body.coverImageAlt, 300);
  if (body.authorId !== undefined) {
    const authorId = (body.authorId || null) as string | null;
    if (authorId && authorId !== article.authorId && !(await authors.findById(authorId))) {
      return badRequest("Auteur invalide");
    }
    article.authorId = authorId;
  }
  if (body.category !== undefined) article.category = str(body.category, 100);
  if (body.tags !== undefined) article.tags = cleanTags(body.tags);
  if (body.featured !== undefined) article.featured = Boolean(body.featured);
  if (body.favorite !== undefined) article.favorite = Boolean(body.favorite);

  const { status, publishedAt } = body;
  const scheduledAt = parseDate(publishedAt);
  if (status !== undefined && status !== article.status) {
    article.status = status as ArticleStatus;
    if (status === "published") {
      article.publishedAt = article.publishedAt ?? new Date();
    } else if (status === "scheduled") {
      article.publishedAt = scheduledAt ?? article.publishedAt;
    } else if (status === "draft") {
      article.publishedAt = null;
    }
  } else if (status === "scheduled" && publishedAt !== undefined) {
    article.publishedAt = scheduledAt;
  }

  let saved;
  try {
    saved = await articles.save(article);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }
    if (isForeignKeyError(err)) return badRequest("Auteur invalide");
    throw err;
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/blog/${saved.slug}`);
  if (saved.slug !== previousSlug) revalidatePath(`/blog/${previousSlug}`);

  return NextResponse.json({ success: true, article: saved });
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
  const deleted = await articles.deleteById(id);

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (deleted) revalidatePath(`/blog/${deleted.slug}`);

  return NextResponse.json({ success: true });
}
