"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteArticleButton from "./DeleteArticleButton";
import styles from "./ArticleAdminList.module.css";

export type AdminArticleRow = {
  id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  category: string;
  status: "draft" | "scheduled" | "published";
  publishedAt: string | null;
  views: number;
  coverImageUrl: string | null;
};

const STATUS_LABEL: Record<AdminArticleRow["status"], string> = {
  draft: "Brouillon",
  scheduled: "Programmé",
  published: "Publié",
};

const STATUS_BADGE_CLASS: Record<AdminArticleRow["status"], string> = {
  draft: styles.statusDraft,
  scheduled: styles.statusScheduled,
  published: styles.statusPublished,
};

const FILTERS: { key: "all" | AdminArticleRow["status"]; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "published", label: "Publiés" },
  { key: "draft", label: "Brouillons" },
  { key: "scheduled", label: "Programmés" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR");
}

function effectiveStatus(row: AdminArticleRow): AdminArticleRow["status"] {
  if (row.status === "scheduled" && row.publishedAt && new Date(row.publishedAt) <= new Date()) {
    return "published";
  }
  return row.status;
}

export default function ArticleAdminList({ initialArticles }: { initialArticles: AdminArticleRow[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [prevInitialArticles, setPrevInitialArticles] = useState(initialArticles);
  if (initialArticles !== prevInitialArticles) {
    setPrevInitialArticles(initialArticles);
    setArticles(initialArticles);
  }
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | AdminArticleRow["status"]>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const counts = useMemo(
    () => ({
      published: articles.filter((a) => effectiveStatus(a) === "published").length,
      draft: articles.filter((a) => effectiveStatus(a) === "draft").length,
      scheduled: articles.filter((a) => effectiveStatus(a) === "scheduled").length,
      views: articles.reduce((sum, a) => sum + a.views, 0),
    }),
    [articles]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (filter !== "all" && effectiveStatus(a) !== filter) return false;
      if (!q) return true;
      return (
        a.titleFr.toLowerCase().includes(q) ||
        a.titleEn.toLowerCase().includes(q) ||
        a.slug.includes(q)
      );
    });
  }, [articles, query, filter]);

  function toggleSelect(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : s.concat(id)));
  }

  async function bulkSetStatus(status: "published" | "draft") {
    setBulkLoading(true);
    await Promise.all(
      selected.map((id) =>
        fetch(`/api/admin/blog/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
    );
    setArticles((list) =>
      list.map((a) =>
        selected.includes(a.id)
          ? { ...a, status, publishedAt: status === "published" ? new Date().toISOString() : null }
          : a
      )
    );
    setSelected([]);
    setBulkLoading(false);
    router.refresh();
  }

  const kpis = [
    { label: "Publiés", value: counts.published, hint: "visibles sur /blog" },
    { label: "Brouillons", value: counts.draft, hint: "en cours de rédaction" },
    { label: "Programmés", value: counts.scheduled, hint: "en attente de publication" },
    { label: "Vues totales", value: counts.views, hint: "tous articles confondus" },
  ];

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Articles</h1>
          <p className={styles.pageSubtitle}>
            Collection <span>posts</span> — contenu bilingue FR / EN.
          </p>
        </div>
        <input
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article…"
        />
      </div>

      <div className={styles.kpiGrid}>
        {kpis.map((k) => (
          <div key={k.label} className={styles.kpiCard}>
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={styles.kpiValue}>{k.value}</div>
            <div className={styles.kpiHint}>{k.hint}</div>
          </div>
        ))}
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterPills}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.pill} ${filter === f.key ? styles.pillActive : ""}`}
              onClick={() => {
                setFilter(f.key);
                setSelected([]);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className={styles.resultLabel}>
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </div>
      </div>

      {selected.length > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkLabel}>
            {selected.length} article{selected.length > 1 ? "s" : ""} sélectionné
            {selected.length > 1 ? "s" : ""}
          </span>
          <div className={styles.bulkActions}>
            <button
              type="button"
              className={styles.bulkPublish}
              disabled={bulkLoading}
              onClick={() => bulkSetStatus("published")}
            >
              Publier
            </button>
            <button
              type="button"
              className={styles.bulkDraft}
              disabled={bulkLoading}
              onClick={() => bulkSetStatus("draft")}
            >
              Repasser en brouillon
            </button>
            <button type="button" className={styles.bulkClear} onClick={() => setSelected([])}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span></span>
          <span>Titre</span>
          <span>Catégorie</span>
          <span>Statut</span>
          <span>Publié le</span>
          <span>Vues</span>
          <span>Actions</span>
        </div>

        {filtered.map((row) => {
          const checked = selected.includes(row.id);
          return (
            <div key={row.id} className={styles.tableRow}>
              <button
                type="button"
                className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ""}`}
                onClick={() => toggleSelect(row.id)}
              >
                {checked ? "✓" : ""}
              </button>
              <div className={styles.titleCell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={row.coverImageUrl || "/ultramaille-logo.svg"}
                  alt=""
                  className={styles.thumb}
                />
                <div style={{ minWidth: 0 }}>
                  <Link href={`/admin/blog/${row.id}/edit`} className={styles.titleLink}>
                    {row.titleFr || "(sans titre)"}
                  </Link>
                  <div className={styles.slugLine}>/blog/{row.slug}</div>
                </div>
              </div>
              <span className={styles.categoryCell}>{row.category || "—"}</span>
              <span className={`${styles.statusBadge} ${STATUS_BADGE_CLASS[effectiveStatus(row)]}`}>
                {STATUS_LABEL[effectiveStatus(row)]}
              </span>
              <span className={styles.dateCell}>{formatDate(row.publishedAt)}</span>
              <span className={styles.viewsCell}>{row.views}</span>
              <div className={styles.actionsCell}>
                <Link href={`/admin/blog/${row.id}/edit`} className={styles.editLink}>
                  Éditer
                </Link>
                <DeleteArticleButton id={row.id} title={row.titleFr || row.slug} />
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Aucun article ne correspond</div>
            <div className={styles.emptyText}>Modifiez la recherche ou le filtre de statut.</div>
          </div>
        )}
      </div>
    </div>
  );
}
