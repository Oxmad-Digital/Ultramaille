import type { PoolClient } from "@neondatabase/serverless";
import { query, type Row } from "@/lib/db";
import { count, date, dateOrNull, ids, text, textOrNull } from "./rows";

export type ArticleStatus = "draft" | "scheduled" | "published";
export type LocalizedText = { fr: string; en: string };
export type ReadingMinutes = { fr: number; en: number };

export type Article = {
  _id: string;
  id: string;
  title: LocalizedText;
  slug: string;
  excerpt: LocalizedText;
  content: LocalizedText;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  coverImageAlt: string;
  authorId: string | null;
  category: string;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  favorite: boolean;
  publishedAt: Date | null;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  views: number;
  readingMinutes?: ReadingMinutes;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleInput = Omit<Article, "_id" | "id" | "views" | "createdAt" | "updatedAt">;

// Colonnes modifiables, dans l'ordre de writableValues().
const WRITABLE = [
  "slug", "title_fr", "title_en", "excerpt_fr", "excerpt_en", "content_fr", "content_en",
  "meta_title_fr", "meta_title_en", "meta_description_fr", "meta_description_en",
  "cover_image_url", "cover_image_public_id", "cover_image_alt", "author_id", "category",
  "tags", "status", "featured", "favorite", "published_at", "reading_minutes",
];

// Liste publique : sans le contenu ni les métadonnées SEO.
const SUMMARY_COLUMNS =
  "id, slug, title_fr, title_en, excerpt_fr, excerpt_en, cover_image_url, " +
  "cover_image_public_id, cover_image_alt, author_id, category, tags, status, featured, " +
  "favorite, published_at, views, reading_minutes, created_at, updated_at";

function writableValues(a: ArticleInput): unknown[] {
  return [
    a.slug, a.title.fr, a.title.en, a.excerpt.fr, a.excerpt.en, a.content.fr, a.content.en,
    a.metaTitle.fr, a.metaTitle.en, a.metaDescription.fr, a.metaDescription.en,
    a.coverImageUrl, a.coverImagePublicId, a.coverImageAlt, a.authorId, a.category,
    a.tags, a.status, a.featured, a.favorite, a.publishedAt,
    a.readingMinutes ? JSON.stringify(a.readingMinutes) : null,
  ];
}

function localized(r: Row, column: string): LocalizedText {
  return { fr: text(r[`${column}_fr`]), en: text(r[`${column}_en`]) };
}

function toArticle(r: Row): Article {
  const article: Article = {
    ...ids(r.id),
    title: localized(r, "title"),
    slug: text(r.slug),
    excerpt: localized(r, "excerpt"),
    content: localized(r, "content"),
    coverImageUrl: textOrNull(r.cover_image_url),
    coverImagePublicId: textOrNull(r.cover_image_public_id),
    coverImageAlt: text(r.cover_image_alt),
    authorId: r.author_id ? String(r.author_id) : null,
    category: text(r.category),
    tags: (r.tags as string[] | null) ?? [],
    status: r.status as ArticleStatus,
    featured: Boolean(r.featured),
    favorite: Boolean(r.favorite),
    publishedAt: dateOrNull(r.published_at),
    metaTitle: localized(r, "meta_title"),
    metaDescription: localized(r, "meta_description"),
    views: Number(r.views ?? 0),
    createdAt: date(r.created_at),
    updatedAt: date(r.updated_at),
  };
  if (r.reading_minutes) article.readingMinutes = r.reading_minutes as ReadingMinutes;
  return article;
}

export const articles = {
  async findAll(): Promise<Article[]> {
    const rows = await query("SELECT * FROM articles ORDER BY created_at DESC");
    return rows.map(toArticle);
  },

  async findById(id: string): Promise<Article | null> {
    const [row] = await query("SELECT * FROM articles WHERE id = $1", [id]);
    return row ? toArticle(row) : null;
  },

  async findPublishedBySlug(slug: string): Promise<Article | null> {
    const [row] = await query(
      "SELECT * FROM articles WHERE slug = $1 AND status = 'published'",
      [slug]
    );
    return row ? toArticle(row) : null;
  },

  // content, metaTitle et metaDescription reviennent vides.
  async findPublishedSummaries(): Promise<Article[]> {
    const rows = await query(
      `SELECT ${SUMMARY_COLUMNS} FROM articles WHERE status = 'published' ` +
        "ORDER BY published_at DESC NULLS LAST"
    );
    return rows.map(toArticle);
  },

  async findContents(articleIds: string[]): Promise<{ _id: string; content: LocalizedText }[]> {
    if (articleIds.length === 0) return [];
    const rows = await query(
      "SELECT id, content_fr, content_en FROM articles WHERE id = ANY($1::uuid[])",
      [articleIds]
    );
    return rows.map((r) => ({ _id: String(r.id), content: localized(r, "content") }));
  },

  async setReadingMinutes(entries: [string, ReadingMinutes][]) {
    if (entries.length === 0) return;
    await query(
      "UPDATE articles a SET reading_minutes = v.minutes::jsonb " +
        "FROM unnest($1::uuid[], $2::text[]) AS v(id, minutes) WHERE a.id = v.id",
      [entries.map(([id]) => id), entries.map(([, minutes]) => JSON.stringify(minutes))]
    );
  },

  async findPublishedForSitemap(): Promise<{ slug: string; updatedAt: Date; publishedAt: Date | null }[]> {
    const rows = await query(
      "SELECT slug, updated_at, published_at FROM articles WHERE status = 'published'"
    );
    return rows.map((r) => ({
      slug: text(r.slug),
      updatedAt: date(r.updated_at),
      publishedAt: dateOrNull(r.published_at),
    }));
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const rows = await query(
      "SELECT 1 FROM articles WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2::uuid) LIMIT 1",
      [slug, excludeId ?? null]
    );
    return rows.length > 0;
  },

  async create(input: ArticleInput): Promise<Article> {
    const placeholders = WRITABLE.map((_, i) => `$${i + 1}`).join(", ");
    const [row] = await query(
      `INSERT INTO articles (${WRITABLE.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      writableValues(input)
    );
    return toArticle(row);
  },

  // Équivalent de document.save() : réécrit tous les champs modifiables.
  async save(article: Article): Promise<Article> {
    const assignments = WRITABLE.map((c, i) => `${c} = $${i + 2}`).join(", ");
    const [row] = await query(
      `UPDATE articles SET ${assignments} WHERE id = $1 RETURNING *`,
      [article.id, ...writableValues(article)]
    );
    return toArticle(row);
  },

  async deleteById(id: string): Promise<Article | null> {
    const [row] = await query("DELETE FROM articles WHERE id = $1 RETURNING *", [id]);
    return row ? toArticle(row) : null;
  },

  async incrementViews(id: string) {
    await query("UPDATE articles SET views = views + 1 WHERE id = $1", [id]);
  },

  async publishDue() {
    await query(
      "UPDATE articles SET status = 'published' WHERE status = 'scheduled' AND published_at <= now()"
    );
  },

  async count(): Promise<number> {
    const [row] = await query("SELECT count(*) AS n FROM articles");
    return count(row.n);
  },

  async countByCategory(): Promise<Map<string, number>> {
    const rows = await query("SELECT category, count(*) AS n FROM articles GROUP BY category");
    return new Map(rows.map((r) => [text(r.category), count(r.n)]));
  },

  // Utilisés dans les transactions de categories.
  async renameCategory(client: PoolClient, oldName: string, newName: string) {
    await client.query("UPDATE articles SET category = $2 WHERE category = $1", [oldName, newName]);
  },

  async clearCategory(client: PoolClient, name: string) {
    await client.query("UPDATE articles SET category = '' WHERE category = $1", [name]);
  },
};
