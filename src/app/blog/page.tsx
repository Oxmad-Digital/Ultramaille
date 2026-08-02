import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog — Ultramaille",
  description: "Actualités, savoir-faire et coulisses de l'atelier Ultramaille à Madagascar.",
};

export const dynamic = "force-dynamic";

type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string;
};

async function getPublishedArticles(): Promise<ArticleSummary[]> {
  await connectDB();
  const articles = await Article.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .lean();

  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt
      ? new Date(a.publishedAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
  }));
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <div className={styles.page}>
      <Header ctaHref="/contact#form" />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>— Blog</div>
          <h1 className={styles.title}>Actualités &amp; savoir-faire</h1>
          <p className={styles.intro}>
            Coulisses de l&apos;atelier, techniques de maille et actualités d&apos;Ultramaille, depuis
            Antananarivo.
          </p>
        </div>
      </section>

      {articles.length === 0 ? (
        <p className={styles.empty}>Aucun article publié pour le moment.</p>
      ) : (
        <div className={styles.grid}>
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className={styles.card}>
              <div className={styles.cardImageWrap}>
                {article.coverImageUrl && (
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    className={styles.cardImage}
                  />
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardDate}>{article.publishedAt}</span>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                {article.excerpt && <p className={styles.cardExcerpt}>{article.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
