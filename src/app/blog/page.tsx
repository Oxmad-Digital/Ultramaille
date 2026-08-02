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
  readingMinutes: number;
};

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

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
    readingMinutes: estimateReadingMinutes(a.content),
  }));
}

function CoverPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.placeholder} ${compact ? styles.placeholderCompact : ""}`}>
      <div className={styles.placeholderGrid} />
      <img src="/ultramaille-logo.svg" alt="" className={styles.placeholderLogo} />
    </div>
  );
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();
  const [featured, ...rest] = articles;

  return (
    <div className={styles.page}>
      <Header ctaHref="/contact#form" />

      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>— Blog</div>
          <h1 className={styles.title}>Actualités &amp; savoir-faire</h1>
          <p className={styles.intro}>
            Coulisses de l&apos;atelier, techniques de maille et actualités d&apos;Ultramaille, depuis
            Antananarivo.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          {articles.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyBadge}>—</div>
              <h2 className={styles.emptyTitle}>Aucun article publié pour le moment</h2>
              <p className={styles.emptyText}>
                Nos coulisses d&apos;atelier arrivent bientôt. En attendant, n&apos;hésitez pas à nous
                contacter directement pour échanger sur votre projet.
              </p>
              <Link href="/contact" className={styles.emptyLink}>
                Nous contacter →
              </Link>
            </div>
          ) : (
            <>
              <Link href={`/blog/${featured.slug}`} className={styles.featured}>
                <div className={styles.featuredImageWrap}>
                  {featured.coverImageUrl ? (
                    <Image
                      src={featured.coverImageUrl}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 640px"
                      className={styles.featuredImage}
                    />
                  ) : (
                    <CoverPlaceholder />
                  )}
                </div>
                <div className={styles.featuredBody}>
                  <span className={styles.featuredEyebrow}>— Dernier article</span>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  {featured.excerpt && <p className={styles.featuredExcerpt}>{featured.excerpt}</p>}
                  <div className={styles.meta}>
                    <span>{featured.publishedAt}</span>
                    <span className={styles.metaDot}>·</span>
                    <span>{featured.readingMinutes} min de lecture</span>
                  </div>
                  <span className={styles.readLink}>Lire l&apos;article →</span>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className={styles.grid}>
                  {rest.map((article) => (
                    <Link key={article.slug} href={`/blog/${article.slug}`} className={styles.card}>
                      <div className={styles.cardImageWrap}>
                        {article.coverImageUrl ? (
                          <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            fill
                            sizes="(max-width: 700px) 100vw, 380px"
                            className={styles.cardImage}
                          />
                        ) : (
                          <CoverPlaceholder compact />
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.meta}>
                          <span>{article.publishedAt}</span>
                          <span className={styles.metaDot}>·</span>
                          <span>{article.readingMinutes} min de lecture</span>
                        </div>
                        <h2 className={styles.cardTitle}>{article.title}</h2>
                        {article.excerpt && <p className={styles.cardExcerpt}>{article.excerpt}</p>}
                        <span className={styles.readLink}>Lire l&apos;article →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
