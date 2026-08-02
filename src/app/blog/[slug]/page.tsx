import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  await connectDB();
  const article = await Article.findOne({ slug, status: "published" }).lean();
  return article;
}

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
    title: `${article.title} — Ultramaille`,
    description: article.excerpt || undefined,
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

  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className={styles.page}>
      <Header ctaHref="/contact#form" />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/blog" className={styles.back}>
            ← Retour au blog
          </Link>
          {publishedAt && <div className={styles.date}>{publishedAt}</div>}
          <h1 className={styles.title}>{article.title}</h1>
          {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        </div>
      </section>

      {article.coverImageUrl && (
        <div className={styles.coverWrap}>
          <Image src={article.coverImageUrl} alt={article.title} fill priority className={styles.cover} />
        </div>
      )}

      <article className={styles.content}>
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>

      <Footer />
    </div>
  );
}
