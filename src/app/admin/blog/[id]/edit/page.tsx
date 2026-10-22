import { requirePageSession } from "@/lib/requireAdmin";
import { notFound } from "next/navigation";
import { isValidId } from "@/lib/http";
import { articles } from "@/lib/repositories/articles";
import { categories } from "@/lib/repositories/categories";
import { authors } from "@/lib/repositories/authors";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePageSession();
  const { id } = await params;
  // Id non uuid (ex. ancien ObjectId en favori) : 404 plutôt qu'une erreur SQL.
  if (!isValidId(id)) notFound();
  const article = await articles.findById(id);

  if (!article) {
    notFound();
  }

  const [categoryList, authorList] = await Promise.all([categories.findAll(), authors.findAll()]);

  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm
        categories={categoryList.map((c) => c.name)}
        authors={authorList.map((a) => ({ id: a.id, name: a.name }))}
        initial={{
          id: article._id,
          title: { fr: article.title.fr, en: article.title.en },
          slug: article.slug,
          excerpt: { fr: article.excerpt.fr, en: article.excerpt.en },
          content: { fr: article.content.fr, en: article.content.en },
          coverImageUrl: article.coverImageUrl,
          coverImagePublicId: article.coverImagePublicId,
          coverImageAlt: article.coverImageAlt,
          authorId: article.authorId ?? "",
          category: article.category,
          tags: article.tags,
          status: article.status,
          featured: article.featured,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
          metaTitle: { fr: article.metaTitle.fr, en: article.metaTitle.en },
          metaDescription: {
            fr: article.metaDescription.fr,
            en: article.metaDescription.en,
          },
        }}
      />
    </AdminShell>
  );
}
