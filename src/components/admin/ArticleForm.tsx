"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import TiptapImage from "@tiptap/extension-image";
import Youtube, { isValidYoutubeUrl } from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { slugify, estimateReadingMinutes, type LocalizedText } from "@/lib/blog";
import MediaLibraryModal, { type MediaSelection } from "./MediaLibraryModal";
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

const COLOR_PALETTE: { label: string; hex: string }[] = [
  { label: "Marine", hex: "#0f1e30" },
  { label: "Bleu", hex: "#1d4670" },
  { label: "Or", hex: "#e0a338" },
  { label: "Vert", hex: "#2d6a4f" },
  { label: "Rouge", hex: "#8e3b2f" },
  { label: "Gris", hex: "#6a6256" },
];

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hsvToHex(h: number, s: number, v: number) {
  const [r, g, b] = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return { h: 0, s: 0, v: 0 };
  const int = parseInt(match[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  return { h, s, v };
}

const STATUS_OPTIONS: { key: ArticleStatus; label: string }[] = [
  { key: "draft", label: "Brouillon" },
  { key: "scheduled", label: "Programmé" },
  { key: "published", label: "Publié" },
];

function TableInsertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function TableRemoveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8 12h8" />
    </svg>
  );
}

function TableHeaderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <rect x="3.6" y="4.6" width="16.8" height="4.3" rx="1.2" fill="currentColor" fillOpacity="0.28" stroke="none" />
      <path d="M3 9.5h18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7" />
      <path d="M6.5 7l.8 12.2a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

const DEFAULT_ACTIVE_MARKS = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  highlight: false,
  h2: false,
  h3: false,
  blockquote: false,
  bulletList: false,
  codeBlock: false,
  link: false,
  table: false,
};

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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const [videoBarOpen, setVideoBarOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoError, setVideoError] = useState("");
  const [colorBarOpen, setColorBarOpen] = useState(false);
  const [pickerHue, setPickerHue] = useState(0);
  const [pickerSat, setPickerSat] = useState(0);
  const [pickerVal, setPickerVal] = useState(0);
  const [pickerHexInput, setPickerHexInput] = useState("#000000");
  const pickerSquareRef = useRef<HTMLDivElement>(null);
  const pickerHueRef = useRef<HTMLDivElement>(null);
  const [linkBarOpen, setLinkBarOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [linkTextInput, setLinkTextInput] = useState("");
  const [mediaModalTarget, setMediaModalTarget] = useState<"cover" | "content" | null>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<HTMLInputElement>(null);
  const linkTextRef = useRef<HTMLInputElement>(null);
  const linkUrlRef = useRef<HTMLInputElement>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
        Highlight,
        TextStyle,
        Color,
        TiptapImage,
        Youtube.configure({ nocookie: true, width: 640, height: 360 }),
        Placeholder.configure({ placeholder: "Rédigez votre article…" }),
        TableKit.configure({ table: { resizable: true } }),
      ],
      content: content[lang] || "",
      immediatelyRender: false,
      onUpdate: ({ editor: e }) => {
        setContent((c) => ({ ...c, [lang]: e.getHTML() }));
      },
    },
    [lang]
  );

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            highlight: e.isActive("highlight"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            blockquote: e.isActive("blockquote"),
            bulletList: e.isActive("bulletList"),
            codeBlock: e.isActive("codeBlock"),
            link: e.isActive("link"),
            table: e.isActive("table"),
          }
        : DEFAULT_ACTIVE_MARKS,
  }) ?? DEFAULT_ACTIVE_MARKS;

  function handleTitleChange(value: string) {
    setTitle((t) => ({ ...t, [lang]: value }));
    if (lang === "fr" && !slugTouched) {
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
        editor?.chain().focus().setImage({ src: optimizedUrl }).run();
      } else {
        setError("Échec de l'upload de l'image");
      }
    } catch {
      setError("Échec de l'upload de l'image");
    } finally {
      setContentImageUploading(false);
    }
  }

  function handleMediaSelect(item: MediaSelection) {
    if (mediaModalTarget === "cover") {
      setCoverImageUrl(item.url);
      setCoverImagePublicId(item.publicId);
      if (item.alt) setCoverImageAlt(item.alt);
    } else if (mediaModalTarget === "content") {
      const optimizedUrl = item.url.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
      editor?.chain().focus().setImage({ src: optimizedUrl }).run();
    }
    setMediaModalTarget(null);
  }

  function closeAllBars() {
    setVideoBarOpen(false);
    setColorBarOpen(false);
    setLinkBarOpen(false);
  }

  function openVideoBar() {
    closeAllBars();
    setVideoError("");
    setVideoUrlInput("");
    setVideoBarOpen(true);
    requestAnimationFrame(() => videoUrlRef.current?.focus());
  }

  function closeVideoBar() {
    setVideoBarOpen(false);
    setVideoError("");
    setVideoUrlInput("");
  }

  function handleInsertVideo() {
    if (!isValidYoutubeUrl(videoUrlInput)) {
      setVideoError("Lien YouTube invalide");
      return;
    }

    editor?.commands.setYoutubeVideo({ src: videoUrlInput });
    closeVideoBar();
  }

  function insertTable() {
    closeAllBars();
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function openColorBar() {
    closeAllBars();
    setColorBarOpen(true);
  }

  function applyColor(hex: string) {
    editor?.chain().focus().setColor(hex).run();
    const hsv = hexToHsv(hex);
    setPickerHue(hsv.h);
    setPickerSat(hsv.s * 100);
    setPickerVal(hsv.v * 100);
    setPickerHexInput(hex);
  }

  function clearColor() {
    editor?.chain().focus().unsetColor().run();
  }

  function commitPickerColor(h: number, s: number, v: number) {
    setPickerHue(h);
    setPickerSat(s);
    setPickerVal(v);
    const hex = hsvToHex(h, s / 100, v / 100);
    setPickerHexInput(hex);
    editor?.chain().focus().setColor(hex).run();
  }

  function handleSquarePointerDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = pickerSquareRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const update = (clientX: number, clientY: number) => {
      const x = clamp01((clientX - rect.left) / rect.width);
      const y = clamp01((clientY - rect.top) / rect.height);
      commitPickerColor(pickerHue, x * 100, (1 - y) * 100);
    };
    update(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => update(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleHuePointerDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = pickerHueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const update = (clientY: number) => {
      const y = clamp01((clientY - rect.top) / rect.height);
      commitPickerColor(y * 360, pickerSat, pickerVal);
    };
    update(e.clientY);
    const onMove = (ev: MouseEvent) => update(ev.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleHexInputChange(value: string) {
    setPickerHexInput(value);
    const hex = value.startsWith("#") ? value : `#${value}`;
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      const hsv = hexToHsv(hex);
      setPickerHue(hsv.h);
      setPickerSat(hsv.s * 100);
      setPickerVal(hsv.v * 100);
      editor?.chain().focus().setColor(hex).run();
    }
  }

  function openLinkBar() {
    closeAllBars();
    const { from, to } = editor?.state.selection ?? { from: 0, to: 0 };
    const selectedText = editor?.state.doc.textBetween(from, to, " ") ?? "";
    setLinkTextInput(selectedText);
    setLinkUrlInput(editor?.getAttributes("link").href ?? "");
    setLinkBarOpen(true);
    requestAnimationFrame(() => (selectedText ? linkUrlRef : linkTextRef).current?.focus());
  }

  function closeLinkBar() {
    setLinkBarOpen(false);
    setLinkUrlInput("");
    setLinkTextInput("");
  }

  function handleInsertLink() {
    const url = linkUrlInput.trim();

    if (!url) {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      closeLinkBar();
      return;
    }

    const label = linkTextInput.trim() || url;
    const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const { from, to } = editor?.state.selection ?? { from: 0, to: 0 };

    editor
      ?.chain()
      .focus()
      .insertContentAt({ from, to }, `<a href="${escape(url)}">${escape(label)}</a>`)
      .run();

    closeLinkBar();
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

    const isContentEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";
    const finalContent: LocalizedText = {
      fr: isContentEmpty(content.fr) ? "" : content.fr,
      en: isContentEmpty(content.en) ? "" : content.en,
    };

    if (!finalContent.fr) {
      setError("Le contenu de l'article (FR) est requis");
      setSaving(false);
      return;
    }

    const finalStatus: ArticleStatus = publishNow ? "published" : status;

    const payload = {
      title,
      slug: slug || slugify(title.fr),
      excerpt,
      content: finalContent,
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

  const plainText = editor?.getText() ?? "";
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readingMinutes = estimateReadingMinutes(plainText);

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
              <button
                type="button"
                title="Gras"
                className={`${styles.toolButton} ${active.bold ? styles.toolButtonActive : ""}`}
                style={{ fontWeight: 700 }}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                B
              </button>
              <button
                type="button"
                title="Italique"
                className={`${styles.toolButton} ${active.italic ? styles.toolButtonActive : ""}`}
                style={{ fontStyle: "italic" }}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                I
              </button>
              <button
                type="button"
                title="Souligné"
                className={`${styles.toolButton} ${active.underline ? styles.toolButtonActive : ""}`}
                style={{ textDecoration: "underline" }}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                U
              </button>
              <button
                type="button"
                title="Barré"
                className={`${styles.toolButton} ${active.strike ? styles.toolButtonActive : ""}`}
                style={{ textDecoration: "line-through" }}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              >
                S
              </button>
              <button
                type="button"
                title="Surligner"
                className={`${styles.toolButton} ${active.highlight ? styles.toolButtonActive : ""}`}
                style={{ background: "rgba(224, 163, 56, 0.28)" }}
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
              >
                Surligner
              </button>
              <button
                type="button"
                title="Titre H2"
                className={`${styles.toolButton} ${active.h2 ? styles.toolButtonActive : ""}`}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </button>
              <button
                type="button"
                title="Titre H3"
                className={`${styles.toolButton} ${active.h3 ? styles.toolButtonActive : ""}`}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                H3
              </button>
              <button
                type="button"
                title="Citation"
                className={`${styles.toolButton} ${active.blockquote ? styles.toolButtonActive : ""}`}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              >
                &rdquo;
              </button>
              <button
                type="button"
                title="Lien"
                className={`${styles.toolButton} ${active.link || linkBarOpen ? styles.toolButtonActive : ""}`}
                onClick={() => (linkBarOpen ? closeLinkBar() : openLinkBar())}
              >
                Lien
              </button>
              <button
                type="button"
                title="Liste à puces"
                className={`${styles.toolButton} ${active.bulletList ? styles.toolButtonActive : ""}`}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                Liste
              </button>
              <button
                type="button"
                title="Bloc de code"
                className={`${styles.toolButton} ${active.codeBlock ? styles.toolButtonActive : ""}`}
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              >
                {"{ }"}
              </button>
              <button
                type="button"
                title="Insérer un tableau"
                className={`${styles.toolButton} ${active.table ? styles.toolButtonActive : ""}`}
                disabled={active.table}
                onClick={insertTable}
              >
                Tableau
              </button>
              <div className={styles.colorTool}>
                <button
                  type="button"
                  className={`${styles.toolButton} ${colorBarOpen ? styles.toolButtonActive : ""}`}
                  title="Couleur du texte"
                  onClick={() => (colorBarOpen ? closeAllBars() : openColorBar())}
                >
                  Couleur
                </button>

                {colorBarOpen && (
                  <div className={styles.colorPopup}>
                    <div className={styles.colorPopupHeader}>
                      <button
                        type="button"
                        className={styles.colorBarClose}
                        title="Fermer"
                        aria-label="Fermer"
                        onClick={closeAllBars}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <path d="M5 5l14 14M19 5L5 19" />
                        </svg>
                      </button>
                    </div>

                    <div className={styles.colorPickerMain}>
                      <div
                        ref={pickerSquareRef}
                        className={styles.colorPickerSquare}
                        style={{ backgroundColor: `hsl(${pickerHue}, 100%, 50%)` }}
                        onMouseDown={handleSquarePointerDown}
                      >
                        <div
                          className={styles.colorPickerSquareCursor}
                          style={{ left: `${pickerSat}%`, top: `${100 - pickerVal}%` }}
                        />
                      </div>
                      <div ref={pickerHueRef} className={styles.colorPickerHue} onMouseDown={handleHuePointerDown}>
                        <div className={styles.colorPickerHueCursor} style={{ top: `${(pickerHue / 360) * 100}%` }} />
                      </div>
                    </div>

                    <div className={styles.colorPickerHexRow}>
                      <span className={styles.colorPickerPreview} style={{ background: pickerHexInput }} />
                      <div className={styles.colorPickerHexField}>
                        <span className={styles.colorPickerHexLabel}>HEX</span>
                        <input
                          type="text"
                          className={styles.colorPickerHexInput}
                          value={pickerHexInput}
                          onChange={(e) => handleHexInputChange(e.target.value)}
                          autoComplete="off"
                          spellCheck={false}
                        />
                      </div>
                    </div>

                    <div className={styles.colorSwatchRow}>
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          title={c.label}
                          className={styles.colorSwatch}
                          style={{ background: c.hex }}
                          onClick={() => applyColor(c.hex)}
                        />
                      ))}
                      <button type="button" className={styles.videoBarCancel} onClick={clearColor}>
                        Effacer
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                className={styles.toolButton}
                disabled={contentImageUploading}
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
                className={styles.toolButton}
                title="Choisir depuis la bibliothèque de médias"
                onClick={() => setMediaModalTarget("content")}
              >
                Bibliothèque
              </button>
              <button
                type="button"
                className={`${styles.toolButton} ${videoBarOpen ? styles.toolButtonActive : ""}`}
                title="Insérer une vidéo YouTube"
                onClick={() => (videoBarOpen ? closeVideoBar() : openVideoBar())}
              >
                Vidéo
              </button>
              <span className={styles.toolbarSpacer}>body.{lang}</span>
            </div>

            {linkBarOpen && (
              <div className={styles.videoBar}>
                <input
                  ref={linkTextRef}
                  type="text"
                  className={styles.videoBarInput}
                  placeholder="Texte affiché"
                  value={linkTextInput}
                  onChange={(e) => setLinkTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeLinkBar();
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInsertLink();
                    }
                  }}
                />
                <input
                  ref={linkUrlRef}
                  type="url"
                  className={styles.videoBarInput}
                  placeholder="https://…"
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeLinkBar();
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInsertLink();
                    }
                  }}
                />
                <button type="button" className={styles.videoBarSubmit} onClick={handleInsertLink}>
                  {linkUrlInput.trim() ? "Insérer" : "Retirer le lien"}
                </button>
                <button type="button" className={styles.videoBarCancel} onClick={closeLinkBar}>
                  Annuler
                </button>
              </div>
            )}

            {videoBarOpen && (
              <div className={styles.videoBar}>
                <input
                  ref={videoUrlRef}
                  type="url"
                  className={styles.videoBarInput}
                  placeholder="https://www.youtube.com/watch?v=…"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeVideoBar();
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInsertVideo();
                    }
                  }}
                />
                <button type="button" className={styles.videoBarSubmit} onClick={handleInsertVideo}>
                  Insérer
                </button>
                <button type="button" className={styles.videoBarCancel} onClick={closeVideoBar}>
                  Annuler
                </button>
                {videoError && <span className={styles.videoBarError}>{videoError}</span>}
              </div>
            )}

            {active.table && (
              <div className={styles.tableBar}>
                <div className={styles.tableBarGroup}>
                  <span className={styles.tableBarLabel}>Colonne</span>
                  <button
                    type="button"
                    className={styles.tableBarButton}
                    title="Insérer une colonne avant"
                    onClick={() => editor?.chain().focus().addColumnBefore().run()}
                  >
                    <TableInsertIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.tableBarButton}
                    title="Insérer une colonne après"
                    onClick={() => editor?.chain().focus().addColumnAfter().run()}
                  >
                    <TableInsertIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.tableBarButton}
                    title="Supprimer la colonne"
                    onClick={() => editor?.chain().focus().deleteColumn().run()}
                  >
                    <TableRemoveIcon />
                  </button>
                </div>

                <span className={styles.tableBarDivider} />

                <div className={styles.tableBarGroup}>
                  <span className={styles.tableBarLabel}>Ligne</span>
                  <button
                    type="button"
                    className={styles.tableBarButton}
                    title="Insérer une ligne avant"
                    onClick={() => editor?.chain().focus().addRowBefore().run()}
                  >
                    <TableInsertIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.tableBarButton}
                    title="Insérer une ligne après"
                    onClick={() => editor?.chain().focus().addRowAfter().run()}
                  >
                    <TableInsertIcon />
                  </button>
                  <button
                    type="button"
                    className={styles.tableBarButton}
                    title="Supprimer la ligne"
                    onClick={() => editor?.chain().focus().deleteRow().run()}
                  >
                    <TableRemoveIcon />
                  </button>
                </div>

                <span className={styles.tableBarDivider} />

                <button
                  type="button"
                  className={styles.tableBarButton}
                  title="Basculer la ligne d'en-tête"
                  onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
                >
                  <TableHeaderIcon />
                </button>

                <button
                  type="button"
                  className={styles.tableBarDelete}
                  onClick={() => editor?.chain().focus().deleteTable().run()}
                >
                  <TrashIcon />
                  Supprimer le tableau
                </button>
              </div>
            )}

            <div className={styles.editorPreview}>
              <EditorContent editor={editor} />
            </div>

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
              <button
                type="button"
                className={styles.coverLibrary}
                onClick={() => setMediaModalTarget("cover")}
              >
                Bibliothèque
              </button>
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

      <MediaLibraryModal
        open={mediaModalTarget !== null}
        onClose={() => setMediaModalTarget(null)}
        onSelect={handleMediaSelect}
      />
    </form>
  );
}
