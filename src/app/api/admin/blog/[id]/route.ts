import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Article from "@/models/Article";
import {
  ARTICLE_STATUSES,
  slugify,
  applyLocalized,
  cleanTags,
  parseDate,
  estimateReadingMinutes,
} from "@/lib/blog";
import { badRequest, invalidId, isDuplicateKeyError, isValidId, readJson, str } from "@/lib/http";
import { isCloudinaryUrl } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  if (!isValidId(id)) return invalidId();
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
  if (!isValidId(id)) return invalidId();
  const body = await readJson(request);
  if (!body) return badRequest();

  if (
    body.status !== undefined &&
    !ARTICLE_STATUSES.includes(body.status as (typeof ARTICLE_STATUSES)[number])
  ) {
    return badRequest("Statut invalide");
  }
  if (body.coverImageUrl && !isCloudinaryUrl(body.coverImageUrl)) {
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

  await connectDB();
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  const previousSlug = article.slug;

  if (body.slug !== undefined) {
    const slug = slugify(body.slug as string);
    if (slug !== article.slug) {
      if (await Article.exists({ slug, _id: { $ne: id } })) {
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

  if (body.coverImageUrl !== undefined) article.coverImageUrl = body.coverImageUrl || null;
  if (body.coverImagePublicId !== undefined) {
    article.coverImagePublicId = str(body.coverImagePublicId, 300) || null;
  }
  if (body.coverImageAlt !== undefined) article.coverImageAlt = str(body.coverImageAlt, 300);
  if (body.authorId !== undefined) article.authorId = body.authorId || null;
  if (body.category !== undefined) article.category = str(body.category, 100);
  if (body.tags !== undefined) article.tags = cleanTags(body.tags);
  if (body.featured !== undefined) article.featured = Boolean(body.featured);
  if (body.favorite !== undefined) article.favorite = Boolean(body.favorite);

  const { status, publishedAt } = body;
  const scheduledAt = parseDate(publishedAt);
  if (status !== undefined && status !== article.status) {
    article.status = status;
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

  try {
    await article.save();
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }
    throw err;
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/blog/${article.slug}`);
  if (article.slug !== previousSlug) revalidatePath(`/blog/${previousSlug}`);

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
  if (!isValidId(id)) return invalidId();
  await connectDB();
  const deleted = await Article.findByIdAndDelete(id).lean();

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (deleted) revalidatePath(`/blog/${deleted.slug}`);

  return NextResponse.json({ success: true });
}
