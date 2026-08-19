"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { slugify, estimateReadingMinutes, type LocalizedText } from "@/lib/blog";
import styles from "./ArticleForm.module.css";

const CLOUD_NAME = "wzetrnif";
const EMPTY_LOCALIZED: LocalizedText = { fr: "", en: "" };

type ArticleStatus = "draft" | "scheduled" | "published";

export type ArticleFormValues = {
  id?: string;
  title: LocalizedText;
  slug: string;
  excerpt: LocalizedText;
  content: LocalizedText;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  coverImageAlt: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string | null;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
};

const TOOLBAR: { label: string; title: string; before: string; after: string; style?: CSSProperties }[] = [
  { label: "B", title: "Gras", before: "**", after: "**", style: { fontWeight: 700 } },
  { label: "I", title: "Italique", before: "*", after: "*", style: { fontStyle: "italic" } },
  { label: "U", title: "Souligné", before: "<u>", after: "</u>", style: { textDecoration: "underline" } },
  { label: "S", title: "Barré", before: "~~", after: "~~", style: { textDecoration: "line-through" } },
  { label: "Surligner", title: "Surligner", before: "<mark>", after: "</mark>", style: { background: "rgba(224, 163, 56, 0.28)" } },
  { label: "H2", title: "Titre H2", before: "\n## ", after: "" },
  { label: "H3", title: "Titre H3", before: "\n### ", after: "" },
  { label: "”", title: "Citation", before: "\n> ", after: "" },
  { label: "Lien", title: "Lien", before: "[", after: "](https://)" },
  { label: "Liste", title: "Liste à puces", before: "\n- ", after: "" },
  { label: "{ }", title: "Bloc de code", before: "\n```\n", after: "\n```\n" },
];

const STATUS_OPTIONS: { key: ArticleStatus; label: string }[] = [
  { key: "draft", label: "Brouillon" },
  { key: "scheduled", label: "Programmé" },
  { key: "published", label: "Publié" },
];

function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ArticleForm({
  initial,
  categories = [],
}: {
  initial?: ArticleFormValues;
  categories?: string[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [title, setTitle] = useState<LocalizedText>(initial?.title ?? EMPTY_LOCALIZED);
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState<LocalizedText>(initial?.excerpt ?? EMPTY_LOCALIZED);
  const [content, setContent] = useState<LocalizedText>(initial?.content ?? EMPTY_LOCALIZED);
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [coverImagePublicId, setCoverImagePublicId] = useState(initial?.coverImagePublicId ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(initial?.coverImageAlt ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [status, setStatus] = useState<ArticleStatus>(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [publishedAt, setPublishedAt] = useState(toDatetimeLocalValue(initial?.publishedAt ?? null));
  const [metaTitle, setMetaTitle] = useState<LocalizedText>(initial?.metaTitle ?? EMPTY_LOCALIZED);
  const [metaDescription, setMetaDescription] = useState<LocalizedText>(
    initial?.metaDescription ?? EMPTY_LOCALIZED
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(value: string) {
    setTitle((t) => ({ ...t, [lang]: value }));
    if (lang === "fr" && !slugTouched) {
      setSlug(slugify(value));
    }
  }

  function insertToolbarSyntax(before: string, after: string) {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = content[lang];
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    setContent((c) => ({ ...c, [lang]: next }));
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + before.length + selected.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!preset) {
      setError("Upload preset Cloudinary manquant (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);
      formData.append("folder", "blog");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setCoverImageUrl(data.secure_url);
        setCoverImagePublicId(data.public_id);
      } else {
        setError("Échec de l'upload de l'image");
      }
    } catch {
      setError("Échec de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  }

  async function handleContentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!preset) {
      setError("Upload preset Cloudinary manquant (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");
      return;
    }

    setContentImageUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);
      formData.append("folder", "blog");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        const optimizedUrl = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
        insertToolbarSyntax(`![](${optimizedUrl})`, "");
      } else {
        setError("Échec de l'upload de l'image");
      }
    } catch {
      setError("Échec de l'upload de l'image");
    } finally {
      setContentImageUploading(false);
    }
  }

  function removeCover() {
    setCoverImageUrl("");
    setCoverImagePublicId("");
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const input = e.currentTarget;
    const value = (input.value || "").trim();
    if (value && !tags.includes(value)) setTags((t) => t.concat(value));
    input.value = "";
  }

  function removeTag(tag: string) {
    setTags((t) => t.filter((x) => x !== tag));
  }

  async function handleSubmit(e: React.FormEvent, publishNow?: boolean) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const finalStatus: ArticleStatus = publishNow ? "published" : status;

    const payload = {
      title,
      slug: slug || slugify(title.fr),
      excerpt,
      content,
      coverImageUrl: coverImageUrl || null,
      coverImagePublicId: coverImagePublicId || null,
      coverImageAlt,
      category,
      tags,
      status: finalStatus,
      featured,
      publishedAt:
        finalStatus === "scheduled" && publishedAt ? new Date(publishedAt).toISOString() : undefined,
      metaTitle,
      metaDescription,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erreur lors de l'enregistrement");
        setSaving(false);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Erreur lors de l'enregistrement");
      setSaving(false);
    }
  }

  const activeContent = content[lang];
  const wordCount = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;
  const readingMinutes = estimateReadingMinutes(activeContent || "");

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/blog" className={styles.back}>
            <span className={styles.backIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M11 18l-6-6 6-6" />
              </svg>
            </span>
            Tous les articles
          </Link>
          <h1 className={styles.pageTitle}>{title.fr || "Nouvel article"}</h1>
          {isEdit && (
            <div className={styles.metaLine}>
              <span>_id: {initial?.id}</span>
            </div>
          )}
        </div>
        <div className={styles.headerActions}>
          <div className={styles.langSwitch}>
            <button
              type="button"
              className={`${styles.langButton} ${lang === "fr" ? styles.langButtonActive : ""}`}
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <button
              type="button"
              className={`${styles.langButton} ${lang === "en" ? styles.langButtonActive : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            className={styles.publishButton}
            disabled={saving}
            onClick={(e) => handleSubmit(e, true)}
          >
            Publier
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ---------- Colonne principale ---------- */}
        <div className={styles.main}>
          <div className={`${styles.card} ${styles.mainCard}`}>
            <label className={styles.field}>
              <span className={styles.label}>Titre — title.{lang}</span>
              <input
                className={`${styles.input} ${styles.titleInput}`}
                value={title[lang]}
                onChange={(e) => handleTitleChange(e.target.value)}
                required={lang === "fr"}
              />
            </label>

            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Slug</span>
                <input
                  className={`${styles.input} ${styles.mono}`}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  required
                />
                <span className={styles.hint}>/blog/{slug || "…"}</span>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Catégorie</span>
                <select
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">— Aucune —</option>
                  {(category && !categories.includes(category) ? [category, ...categories] : categories).map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    )
                  )}
                </select>
                <span className={styles.hint}>
                  <Link href="/admin/categories">Gérer les catégories →</Link>
                </span>
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Chapô — excerpt.{lang}</span>
              <textarea
                rows={3}
                className={styles.textarea}
                value={excerpt[lang]}
                onChange={(e) => setExcerpt((x) => ({ ...x, [lang]: e.target.value }))}
              />
              <span className={styles.hint}>{excerpt[lang].length} / 220 caractères</span>
            </label>
          </div>

          <div className={`${styles.card} ${styles.editorCard}`}>
            <div className={styles.toolbar}>
              {TOOLBAR.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  title={t.title}
                  className={styles.toolButton}
                  style={t.style}
                  onClick={() => insertToolbarSyntax(t.before, t.after)}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                className={styles.toolButton}
                disabled={previewMode || contentImageUploading}
                title={previewMode ? "Repasse en mode édition pour insérer une image" : undefined}
                onClick={() => contentImageInputRef.current?.click()}
              >
                {contentImageUploading ? "Envoi…" : "Image"}
              </button>
              <input
                ref={contentImageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleContentImageUpload}
              />
              <button
                type="button"
                className={`${styles.toolButton} ${previewMode ? styles.toolButtonActive : ""}`}
                onClick={() => setPreviewMode((p) => !p)}
              >
                {previewMode ? "Éditer" : "Aperçu"}
              </button>
              <span className={styles.toolbarSpacer}>Markdown · body.{lang}</span>
            </div>

            {previewMode ? (
              <div className={styles.editorPreview}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {activeContent || "*Aperçu du contenu…*"}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                ref={contentRef}
                className={styles.editorTextarea}
                value={activeContent}
                onChange={(e) => setContent((c) => ({ ...c, [lang]: e.target.value }))}
                placeholder="## Titre&#10;&#10;Votre texte en **markdown**…"
                required={lang === "fr"}
              />
            )}

            <div className={styles.editorFooter}>
              <span>
                {wordCount} mot{wordCount > 1 ? "s" : ""} · {readingMinutes} min de lecture
              </span>
            </div>
          </div>
        </div>

        {/* ---------- Sidebar ---------- */}
        <div className={styles.sidebar}>
          <div className={styles.darkCard}>
            <div className={styles.darkCardTitle}>Publication</div>
            <div className={styles.darkStack}>
              <div>
                <div className={styles.darkLabel}>Statut</div>
                <div className={styles.statusRow}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      className={`${styles.statusPill} ${status === s.key ? styles.statusPillActive : ""}`}
                      onClick={() => setStatus(s.key)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className={styles.darkLabel}>Date de publication</div>
                <input
                  type="datetime-local"
                  className={styles.darkInput}
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>
              <div className={styles.featuredRow}>
                <span className={styles.featuredLabel}>Mettre à la une</span>
                <button
                  type="button"
                  className={`${styles.toggle} ${featured ? styles.toggleOn : ""}`}
                  onClick={() => setFeatured((f) => !f)}
                >
                  <span className={`${styles.toggleKnob} ${featured ? styles.toggleKnobOn : ""}`} />
                </button>
              </div>
              <div className={styles.authorLine}>
                Statut : {isEdit ? "article existant" : "nouvel article"}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.label} style={{ marginBottom: 16 }}>
              Image de couverture
            </div>
            <div className={styles.coverPreviewWrap}>
              {coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImageUrl} alt="Couverture" className={styles.coverPreviewImg} />
              ) : (
                <div className={styles.coverEmpty}>Aucune image</div>
              )}
            </div>
            <div className={styles.coverActions}>
              <label className={styles.coverUploadLabel}>
                {uploading ? "Envoi…" : coverImageUrl ? "Remplacer" : "Ajouter"}
                <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
              </label>
              {coverImageUrl && (
                <button type="button" className={styles.coverRemove} onClick={removeCover}>
                  Retirer
                </button>
              )}
            </div>
            <label className={styles.field} style={{ marginTop: 12 }}>
              <span className={styles.label}>Texte alternatif</span>
              <input
                className={styles.input}
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
              />
            </label>
          </div>

          <div className={styles.card}>
            <div className={styles.label} style={{ marginBottom: 8 }}>
              Tags
            </div>
            <div className={styles.chipRow}>
              {tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                  <button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className={styles.tagForm}>
              <input name="tag" placeholder="Ajouter un tag + Entrée" onKeyDown={addTag} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.label} style={{ marginBottom: 14 }}>
              SEO — langue {lang}
            </div>
            <label className={styles.field} style={{ marginBottom: 14 }}>
              <span className={styles.label}>meta.title</span>
              <input
                className={styles.input}
                value={metaTitle[lang]}
                onChange={(e) => setMetaTitle((m) => ({ ...m, [lang]: e.target.value }))}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>meta.description</span>
              <textarea
                rows={3}
                className={styles.textarea}
                value={metaDescription[lang]}
                onChange={(e) => setMetaDescription((m) => ({ ...m, [lang]: e.target.value }))}
              />
            </label>
          </div>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
