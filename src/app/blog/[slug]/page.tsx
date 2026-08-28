import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { after } from "next/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogArticleClient from "@/components/blog/BlogArticleClient";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import { publishDueArticles } from "@/lib/publishDueArticles";
import styles from "./page.module.css";

// Public article is CMS-backed but doesn't need to be dynamic per-request:
// served from cache and refreshed on a short interval, plus revalidated
// on-demand from the admin article routes.
export const revalidate = 60;

// cache() dedupes this read within a single render pass so generateMetadata and
// the page component share one DB call.
const getArticle = cache(async (slug: string) => {
  await connectDB();
  after(() => publishDueArticles());
  const article = await Article.findOne({ slug, status: "published" }).lean();
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

  // Fire-and-forget, and only runs when the page is actually (re)generated —
  // not blocking the response. Precise per-visit analytics already live in
  // the PageView-based stats dashboard; this counter is an approximate,
  // revalidation-cadence figure shown in the admin article list.
  after(() => Article.updateOne({ _id: article._id }, { $inc: { views: 1 } }));

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
