import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
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
    <ArticleForm
      initial={{
        id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImageUrl: article.coverImageUrl,
        coverImagePublicId: article.coverImagePublicId,
        status: article.status,
      }}
    />
  );
}
