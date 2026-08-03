"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/lib/language-context";
import type { LocalizedText } from "@/lib/blog";
import styles from "@/app/blog/[slug]/page.module.css";

export type PublicArticleDetail = {
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  coverImageUrl: string | null;
  coverImageAlt: string;
  publishedAt: string;
};

export default function BlogArticleClient({ article }: { article: PublicArticleDetail }) {
  const { lang, t } = useLanguage();
  const publishedLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/blog" className={styles.back}>
            {t("← Retour au blog", "← Back to blog")}
          </Link>
          {publishedLabel && <div className={styles.date}>{publishedLabel}</div>}
          <h1 className={styles.title}>{article.title[lang]}</h1>
          {article.excerpt[lang] && <p className={styles.excerpt}>{article.excerpt[lang]}</p>}
        </div>
      </section>

      {article.coverImageUrl && (
        <div className={styles.coverWrap}>
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt || article.title[lang]}
            fill
            priority
            className={styles.cover}
          />
        </div>
      )}

      <article className={styles.content}>
        <ReactMarkdown>{article.content[lang] || article.content.fr}</ReactMarkdown>
      </article>
    </>
  );
}
