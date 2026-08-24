import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import Category from "@/models/Category";
import Author from "@/models/Author";
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

  const categories = await Category.find({}).sort({ name: 1 }).lean();
  const authors = await Author.find({}).sort({ name: 1 }).lean();

  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm
        categories={categories.map((c) => c.name)}
        authors={authors.map((a) => ({ id: a._id.toString(), name: a.name }))}
        initial={{
          id: article._id.toString(),
          title: { fr: article.title?.fr ?? "", en: article.title?.en ?? "" },
          slug: article.slug,
          excerpt: { fr: article.excerpt?.fr ?? "", en: article.excerpt?.en ?? "" },
          content: { fr: article.content?.fr ?? "", en: article.content?.en ?? "" },
          coverImageUrl: article.coverImageUrl,
          coverImagePublicId: article.coverImagePublicId,
          coverImageAlt: article.coverImageAlt ?? "",
          authorId: article.authorId ? article.authorId.toString() : "",
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
