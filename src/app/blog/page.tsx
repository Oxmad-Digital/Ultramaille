import type { Metadata } from "next";
import Image from "next/image";
import { after } from "next/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogListClient, { type PublicArticle } from "@/components/blog/BlogListClient";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import { estimateReadingMinutes } from "@/lib/blog";
import { publishDueArticles } from "@/lib/publishDueArticles";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog — Ultramaille",
  description: "Actualités, savoir-faire et coulisses de l'atelier Ultramaille à Madagascar.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Ultramaille",
    description: "Actualités, savoir-faire et coulisses de l'atelier Ultramaille à Madagascar.",
    url: "/blog",
    type: "website",
  },
};

// Public listing is CMS-backed but doesn't need to be dynamic per-request:
// served from cache and refreshed on a short interval, plus revalidated
// on-demand from the admin article routes.
export const revalidate = 60;

async function getPublishedArticles(): Promise<PublicArticle[]> {
  await connectDB();
  after(() => publishDueArticles());
  const articles = await Article.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .lean();

  return articles.map((a) => ({
    slug: a.slug,
    title: { fr: a.title?.fr ?? "", en: a.title?.en ?? "" },
    excerpt: { fr: a.excerpt?.fr ?? "", en: a.excerpt?.en ?? "" },
    category: a.category ?? "",
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString() : "",
    readingMinutesFr: estimateReadingMinutes(a.content?.fr ?? ""),
    readingMinutesEn: estimateReadingMinutes(a.content?.en ?? ""),
    featured: Boolean(a.featured),
  }));
}

export default async function BlogPage() {
  const allArticles = await getPublishedArticles();
  const heroIndex = allArticles.findIndex((a) => a.featured);
  const hero = allArticles[heroIndex === -1 ? 0 : heroIndex] ?? null;
  const rest = allArticles.filter((_, i) => i !== (heroIndex === -1 ? 0 : heroIndex));

  return (
    <div className={styles.page}>
      <Header ctaHref="/contact#form" />

      <section className={styles.hero}>
        <Image
          src="https://res.cloudinary.com/wzetrnif/image/upload/v1787856491/background-pull-ultramaille_oi1dox.webp"
          alt="Atelier Ultramaille"
          fill
          priority
          className={styles.heroImg}
        />
        <div className={styles.heroGradient} />
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

      {allArticles.length === 0 ? (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.empty}>
              <div className={styles.emptyBadge}>—</div>
              <h2 className={styles.emptyTitle}>Aucun article publié pour le moment</h2>
              <p className={styles.emptyText}>
                Nos coulisses d&apos;atelier arrivent bientôt. En attendant, n&apos;hésitez pas à nous
                contacter directement pour échanger sur votre projet.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <BlogListClient hero={hero} articles={rest} />
      )}

      <Footer />
    </div>
  );
}
