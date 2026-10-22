import { requirePageSession } from "@/lib/requireAdmin";
import { articles } from "@/lib/repositories/articles";
import AdminShell from "@/components/admin/AdminShell";
import ArticleAdminList, { type AdminArticleRow } from "@/components/admin/ArticleAdminList";

export const dynamic = "force-dynamic";

async function getArticles(): Promise<AdminArticleRow[]> {
  const list = await articles.findAll();
  return list.map((a) => ({
    id: a.id,
    titleFr: a.title.fr,
    titleEn: a.title.en,
    slug: a.slug,
    category: a.category,
    status: a.status,
    favorite: a.favorite,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    views: a.views,
    coverImageUrl: a.coverImageUrl,
  }));
}

export default async function AdminBlogListPage() {
  await requirePageSession();
  const articles = await getArticles();
  return (
    <AdminShell crumb="Articles">
      <ArticleAdminList initialArticles={articles} />
    </AdminShell>
  );
}
