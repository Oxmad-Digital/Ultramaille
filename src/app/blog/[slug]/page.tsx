import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogArticleClient from "@/components/blog/BlogArticleClient";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

// cache() dedupes this read within a single request so generateMetadata and
// the page component share one DB call — the view counter below only runs once.
const getArticle = cache(async (slug: string) => {
  await connectDB();
  const now = new Date();
  const article = await Article.findOne({
    slug,
    $or: [{ status: "published" }, { status: "scheduled", publishedAt: { $lte: now } }],
  }).lean();
  return article;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article introuvable — Ultramaille" };
  }

  return {
    title: `${article.metaTitle?.fr || article.title.fr} — Ultramaille`,
    description: article.metaDescription?.fr || article.excerpt.fr || undefined,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  await Article.updateOne({ _id: article._id }, { $inc: { views: 1 } });

  return (
    <div className={styles.page}>
      <Header ctaHref="/contact#form" />
      <BlogArticleClient
        article={{
          title: { fr: article.title?.fr ?? "", en: article.title?.en ?? "" },
          excerpt: { fr: article.excerpt?.fr ?? "", en: article.excerpt?.en ?? "" },
          content: { fr: article.content?.fr ?? "", en: article.content?.en ?? "" },
          coverImageUrl: article.coverImageUrl,
          coverImageAlt: article.coverImageAlt ?? "",
          publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : "",
        }}
      />
      <Footer />
    </div>
  );
}
