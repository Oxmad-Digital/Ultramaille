"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import styles from "./ArticleForm.module.css";

const CLOUD_NAME = "wzetrnif";

type ArticleFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  status: "draft" | "published";
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticleForm({ initial }: { initial?: ArticleFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [coverImagePublicId, setCoverImagePublicId] = useState(initial?.coverImagePublicId ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
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

  async function handleSubmit(e: React.FormEvent, publishNow?: boolean) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      coverImageUrl: coverImageUrl || null,
      coverImagePublicId: coverImagePublicId || null,
      status: publishNow ? "published" : status,
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

  return (
    <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
      <h1 className={styles.pageTitle}>{isEdit ? "Modifier l'article" : "Nouvel article"}</h1>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Titre
        </label>
        <input
          id="title"
          className={styles.input}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="slug">
          Slug (URL)
        </label>
        <input
          id="slug"
          className={styles.input}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          required
        />
        <span className={styles.hint}>/blog/{slug || "..."}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="excerpt">
          Résumé
        </label>
        <textarea
          id="excerpt"
          className={styles.textarea}
          style={{ minHeight: 80 }}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cover">
          Image de couverture
        </label>
        <input id="cover" type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
        {uploading && <span className={styles.hint}>Envoi en cours...</span>}
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="Couverture" className={styles.coverPreview} />
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Contenu (Markdown)</label>
        <div className={styles.editorGrid}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="## Titre&#10;&#10;Votre texte en **markdown**..."
            required
          />
          <div className={styles.preview}>
            <ReactMarkdown>{content || "*Aperçu du contenu...*"}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">
            Statut
          </label>
          <select
            id="status"
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        {status !== "published" && (
          <button
            type="button"
            className={styles.submitButton}
            disabled={saving}
            onClick={(e) => handleSubmit(e, true)}
          >
            Publier
          </button>
        )}
      </div>
    </form>
  );
}
