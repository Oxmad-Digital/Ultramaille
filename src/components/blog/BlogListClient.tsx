"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { LocalizedText } from "@/lib/blog";
import styles from "@/app/blog/page.module.css";

export type PublicArticle = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: string;
  coverImageUrl: string | null;
  publishedAt: string;
  readingMinutesFr: number;
  readingMinutesEn: number;
  featured: boolean;
};

function CoverPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.placeholder} ${compact ? styles.placeholderCompact : ""}`}>
      <div className={styles.placeholderGrid} />
      <img src="/ultramaille-logo.svg" alt="" className={styles.placeholderLogo} />
    </div>
  );
}

function formatDate(iso: string, lang: "fr" | "en") {
  return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogListClient({
  hero,
  articles,
}: {
  hero: PublicArticle | null;
  articles: PublicArticle[];
}) {
  const { lang, t } = useLanguage();
  const [category, setCategory] = useState("all");
  const [limit, setLimit] = useState(6);
  const [subscribed, setSubscribed] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category).filter(Boolean));
    return Array.from(set).sort();
  }, [articles]);

  const filtered = useMemo(
    () => articles.filter((a) => category === "all" || a.category === category),
    [articles, category]
  );
  const shown = filtered.slice(0, limit);

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <>
      {hero && (
        <section className={styles.section} style={{ paddingBottom: 0 }}>
          <div className={styles.sectionInner}>
            <Link href={`/blog/${hero.slug}`} className={styles.featured}>
              <div className={styles.featuredImageWrap}>
                {hero.coverImageUrl ? (
                  <Image
                    src={hero.coverImageUrl}
                    alt={hero.title[lang]}
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
                <span className={styles.featuredEyebrow}>— {t("Dernier article", "Latest article")}</span>
                <h2 className={styles.featuredTitle}>{hero.title[lang]}</h2>
                {hero.excerpt[lang] && <p className={styles.featuredExcerpt}>{hero.excerpt[lang]}</p>}
                <div className={styles.meta}>
                  <span>{formatDate(hero.publishedAt, lang)}</span>
                  <span className={styles.metaDot}>·</span>
                  <span>
                    {lang === "en" ? hero.readingMinutesEn : hero.readingMinutesFr} min
                  </span>
                </div>
                <span className={styles.readLink}>{t("Lire l'article →", "Read the article →")}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.filterRow}>
            <div className={styles.pillRow}>
              <button
                type="button"
                className={`${styles.pill} ${category === "all" ? styles.pillActive : ""}`}
                onClick={() => {
                  setCategory("all");
                  setLimit(6);
                }}
              >
                {t("Tout", "All")}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.pill} ${category === c ? styles.pillActive : ""}`}
                  onClick={() => {
                    setCategory(c);
                    setLimit(6);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className={styles.countLabel}>
              {filtered.length} {t("articles", "articles")}
            </div>
          </div>

          {shown.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyBadge}>—</div>
              <h2 className={styles.emptyTitle}>{t("Aucun article dans cette catégorie", "No articles in this category")}</h2>
            </div>
          ) : (
            <div className={styles.grid}>
              {shown.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title[lang]}
                        fill
                        sizes="(max-width: 700px) 100vw, 380px"
                        className={styles.cardImage}
                      />
                    ) : (
                      <CoverPlaceholder compact />
                    )}
                    {article.category && <span className={styles.cardCategory}>{article.category}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.meta}>
                      <span>{formatDate(article.publishedAt, lang)}</span>
                      <span className={styles.metaDot}>·</span>
                      <span>{lang === "en" ? article.readingMinutesEn : article.readingMinutesFr} min</span>
                    </div>
                    <h2 className={styles.cardTitle}>{article.title[lang]}</h2>
                    {article.excerpt[lang] && <p className={styles.cardExcerpt}>{article.excerpt[lang]}</p>}
                    <span className={styles.readLink}>{t("Lire l'article →", "Read the article →")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {shown.length < filtered.length && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={() => setLimit((l) => l + 3)}
              >
                {t("Voir plus d'articles", "Load more articles")}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div>
            <div className={styles.newsletterEyebrow}>— Newsletter</div>
            <h2 className={styles.newsletterTitle}>
              {t("Une lettre par saison, depuis l'atelier.", "One letter per season, from the workshop.")}
            </h2>
            <p className={styles.newsletterText}>
              {t(
                "Nouvelles techniques, arrivages de fils, délais de la saison à venir. Sans bruit — quatre emails par an.",
                "New techniques, yarn arrivals, lead times for the coming season. No noise — four emails a year."
              )}
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className={styles.subscribedBox}>
                <div className={styles.subscribedEyebrow}>{t("Inscription confirmée", "You're in")}</div>
                <div className={styles.subscribedText}>
                  {t(
                    "Merci — la prochaine lettre arrive en début de saison.",
                    "Thank you — the next letter arrives at the start of the season."
                  )}
                </div>
              </div>
            ) : (
              <form className={styles.subscribeForm} onSubmit={subscribe}>
                <label className={styles.subscribeLabel}>
                  <span className={styles.subscribeLabelText}>{t("Votre email", "Your email")}</span>
                  <input
                    className={styles.subscribeInput}
                    type="email"
                    required
                    placeholder="jeanne@maison.com"
                  />
                </label>
                <button type="submit" className={styles.subscribeButton}>
                  {t("S'inscrire →", "Subscribe →")}
                </button>
                <span className={styles.subscribeDisclaimer}>
                  {t(
                    "Aucune diffusion de votre adresse. Désinscription en un clic.",
                    "No sharing of your address. Unsubscribe in one click."
                  )}
                </span>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
