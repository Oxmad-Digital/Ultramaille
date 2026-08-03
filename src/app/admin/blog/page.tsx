import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import AdminShell from "@/components/admin/AdminShell";
import ArticleAdminList, { type AdminArticleRow } from "@/components/admin/ArticleAdminList";

export const dynamic = "force-dynamic";

async function getArticles(): Promise<AdminArticleRow[]> {
  await connectDB();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  return articles.map((a) => ({
    id: a._id.toString(),
    titleFr: a.title?.fr ?? "",
    titleEn: a.title?.en ?? "",
    slug: a.slug,
    category: a.category ?? "",
    status: a.status,
    publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString() : null,
    views: a.views ?? 0,
    coverImageUrl: a.coverImageUrl,
  }));
}

export default async function AdminBlogListPage() {
  const articles = await getArticles();
  return (
    <AdminShell crumb="Articles">
      <ArticleAdminList initialArticles={articles} />
    </AdminShell>
  );
}
