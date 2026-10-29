"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MediaLibraryModal.module.css";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "@/lib/uploadImage";

type MediaItem = {
  id: string;
  url: string;
  publicId: string;
  alt: string;
  filename: string;
};

export type MediaSelection = { url: string; publicId: string; alt: string };

export default function MediaLibraryModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaSelection) => void;
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function loadMedia() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/media");
        const data = await res.json();
        if (!cancelled) setMedia(data.media ?? []);
      } catch {
        if (!cancelled) setError("Impossible de charger la bibliothèque");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMedia();
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

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

      onSelect({ url: uploaded.url, publicId: uploaded.publicId, alt: "" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Bibliothèque de médias</div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.body}>
          <button
            type="button"
            className={styles.uploadCard}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Envoi…" : "+ Nouveau média"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            hidden
            onChange={handleUpload}
            disabled={uploading}
          />

          {loading && <div className={styles.status}>Chargement…</div>}
          {!loading && media.length === 0 && (
            <div className={styles.status}>Aucun média dans la bibliothèque.</div>
          )}

          {!loading &&
            media.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.item}
                onClick={() => {
                  onSelect({ url: item.url, publicId: item.publicId, alt: item.alt });
                  onClose();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt} className={styles.itemImg} />
                <span className={styles.itemName}>{item.filename || "Sans nom"}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
