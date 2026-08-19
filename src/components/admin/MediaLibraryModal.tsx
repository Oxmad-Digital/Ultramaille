"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MediaLibraryModal.module.css";

const CLOUD_NAME = "wzetrnif";

type MediaItem = {
  id: string;
  url: string;
  publicId: string;
  alt: string;
  filename: string;
};

export type MediaSelection = { url: string; publicId: string; alt: string };

function uniqueFileForUpload(file: File): File {
  const dot = file.name.lastIndexOf(".");
  const base = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext = dot > 0 ? file.name.slice(dot) : "";
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return new File([file], `${base}-${suffix}${ext}`, { type: file.type });
}

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

    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!preset) {
      setError("Upload preset Cloudinary manquant (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", uniqueFileForUpload(file));
      formData.append("upload_preset", preset);
      formData.append("folder", "media");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.secure_url) {
        setError("Échec de l'upload de l'image");
        return;
      }

      await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.secure_url,
          publicId: data.public_id,
          filename: file.name,
          format: data.format,
          bytes: data.bytes,
          width: data.width,
          height: data.height,
        }),
      });

      onSelect({ url: data.secure_url, publicId: data.public_id, alt: "" });
      onClose();
    } catch {
      setError("Échec de l'upload de l'image");
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
            accept="image/*"
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
