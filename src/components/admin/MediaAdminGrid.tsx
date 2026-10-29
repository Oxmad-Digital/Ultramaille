"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import listStyles from "./ArticleAdminList.module.css";
import styles from "./MediaAdminGrid.module.css";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "@/lib/uploadImage";

export type AdminMediaItem = {
  id: string;
  url: string;
  publicId: string;
  filename: string;
  alt: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} Ko`;
  return `${(kb / 1024).toFixed(1)} Mo`;
}

export default function MediaAdminGrid({ initialMedia }: { initialMedia: AdminMediaItem[] }) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [prevInitialMedia, setPrevInitialMedia] = useState(initialMedia);
  if (initialMedia !== prevInitialMedia) {
    setPrevInitialMedia(initialMedia);
    setMedia(initialMedia);
  }

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadImage(file);

      const createRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...uploaded, filename: file.name }),
      });

      if (!createRes.ok) {
        setError("Échec de l'enregistrement du média");
        return;
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  }

  function startEdit(item: AdminMediaItem) {
    setError("");
    setEditingId(item.id);
    setEditValue(item.alt);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    setError("");

    const res = await fetch(`/api/admin/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: editValue.trim() }),
    });

    if (!res.ok) {
      setError("Erreur lors de la mise à jour");
      setSavingId(null);
      return;
    }

    setSavingId(null);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(item: AdminMediaItem) {
    if (!window.confirm(`Supprimer ce média (${item.filename || item.publicId}) ?`)) return;

    setDeletingId(item.id);
    await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard indisponible, on ignore silencieusement
    }
  }

  return (
    <div>
      <div className={listStyles.header}>
        <div>
          <h1 className={listStyles.pageTitle}>Médias</h1>
          <p className={listStyles.pageSubtitle}>
            Collection <span>media</span> — bibliothèque des images du site.
          </p>
        </div>
        <div className={styles.headerActions}>
          <a
            href="https://squoosh.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.squooshButton}
          >
            Compresser sur Squoosh ↗
          </a>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Envoi…" : "Ajouter un média"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            className={styles.hiddenInput}
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {media.length === 0 ? (
        <div className={listStyles.tableWrap}>
          <div className={listStyles.empty}>
            <div className={listStyles.emptyTitle}>Aucun média</div>
            <div className={listStyles.emptyText}>Ajoutez votre première image ci-dessus.</div>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {media.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.thumbWrap}>
                  <img src={item.url} alt={item.alt} className={styles.thumb} />
                </div>
                <div className={styles.meta}>
                  <div className={styles.filename} title={item.filename}>
                    {item.filename || item.publicId}
                  </div>
                  <div className={styles.dims}>
                    {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                    {formatBytes(item.bytes)}
                  </div>
                  {isEditing ? (
                    <input
                      className={styles.altInput}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Texte alternatif"
                      autoFocus
                    />
                  ) : (
                    <div className={styles.altText}>{item.alt || "Sans texte alternatif"}</div>
                  )}
                </div>
                <div className={styles.actions}>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className={listStyles.editLink}
                        onClick={() => saveEdit(item.id)}
                        disabled={savingId === item.id}
                      >
                        {savingId === item.id ? "…" : "Enregistrer"}
                      </button>
                      <button type="button" className={listStyles.deleteButton} onClick={cancelEdit}>
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className={listStyles.editLink} onClick={() => copyUrl(item.url)}>
                        Copier l&apos;URL
                      </button>
                      <button type="button" className={listStyles.editLink} onClick={() => startEdit(item)}>
                        Alt
                      </button>
                      <button
                        type="button"
                        className={listStyles.deleteButton}
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? "…" : "✕"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
