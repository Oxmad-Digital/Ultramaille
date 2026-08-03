import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const article = await Article.findById(id).lean();

  if (!article) {
    notFound();
  }

  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm
        initial={{
          id: article._id.toString(),
          title: { fr: article.title?.fr ?? "", en: article.title?.en ?? "" },
          slug: article.slug,
          excerpt: { fr: article.excerpt?.fr ?? "", en: article.excerpt?.en ?? "" },
          content: { fr: article.content?.fr ?? "", en: article.content?.en ?? "" },
          coverImageUrl: article.coverImageUrl,
          coverImagePublicId: article.coverImagePublicId,
          coverImageAlt: article.coverImageAlt ?? "",
          category: article.category ?? "",
          tags: article.tags ?? [],
          status: article.status,
          featured: article.featured ?? false,
          publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
          metaTitle: { fr: article.metaTitle?.fr ?? "", en: article.metaTitle?.en ?? "" },
          metaDescription: {
            fr: article.metaDescription?.fr ?? "",
            en: article.metaDescription?.en ?? "",
          },
        }}
      />
    </AdminShell>
  );
}
