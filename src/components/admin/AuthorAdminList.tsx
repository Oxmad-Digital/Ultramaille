"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import listStyles from "./ArticleAdminList.module.css";
import styles from "./AuthorAdminList.module.css";

const CLOUD_NAME = "wzetrnif";

function uniqueFileForUpload(file: File): File {
  const dot = file.name.lastIndexOf(".");
  const base = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext = dot > 0 ? file.name.slice(dot) : "";
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return new File([file], `${base}-${suffix}${ext}`, { type: file.type });
}

export type AdminAuthorRow = {
  id: string;
  name: string;
  slug: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
};

type AuthorFormState = {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  avatarPublicId: string;
};

const EMPTY_FORM: AuthorFormState = { name: "", email: "", bio: "", avatarUrl: "", avatarPublicId: "" };

export default function AuthorAdminList({ initialAuthors }: { initialAuthors: AdminAuthorRow[] }) {
  const router = useRouter();
  const [authors, setAuthors] = useState(initialAuthors);
  const [prevInitialAuthors, setPrevInitialAuthors] = useState(initialAuthors);
  if (initialAuthors !== prevInitialAuthors) {
    setPrevInitialAuthors(initialAuthors);
    setAuthors(initialAuthors);
  }

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<AuthorFormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AuthorFormState>(EMPTY_FORM);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  async function uploadAvatar(file: File): Promise<{ url: string; publicId: string } | null> {
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!preset) {
      setError("Upload preset Cloudinary manquant (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");
      return null;
    }

    const formData = new FormData();
    formData.append("file", uniqueFileForUpload(file));
    formData.append("upload_preset", preset);
    formData.append("folder", "authors");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.secure_url) {
      setError("Échec de l'upload de l'avatar");
      return null;
    }
    return { url: data.secure_url, publicId: data.public_id };
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    const uploaded = await uploadAvatar(file);
    if (uploaded) {
      setForm((f) => ({ ...f, avatarUrl: uploaded.url, avatarPublicId: uploaded.publicId }));
    }
    setUploading(false);
  }

  async function handleEditAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    const uploaded = await uploadAvatar(file);
    if (uploaded) {
      setEditForm((f) => ({ ...f, avatarUrl: uploaded.url, avatarPublicId: uploaded.publicId }));
    }
    setUploading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    setCreating(true);
    setError("");

    const res = await fetch("/api/admin/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erreur lors de la création");
      setCreating(false);
      return;
    }

    setForm(EMPTY_FORM);
    setFormOpen(false);
    setCreating(false);
    router.refresh();
  }

  function startEdit(row: AdminAuthorRow) {
    setError("");
    setEditingId(row.id);
    setEditForm({
      name: row.name,
      email: row.email,
      bio: row.bio,
      avatarUrl: row.avatarUrl ?? "",
      avatarPublicId: row.avatarPublicId ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  }

  async function saveEdit(id: string) {
    const name = editForm.name.trim();
    if (!name) return;

    setSavingId(id);
    setError("");

    const res = await fetch(`/api/admin/authors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erreur lors de la mise à jour");
      setSavingId(null);
      return;
    }

    setSavingId(null);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(row: AdminAuthorRow) {
    if (!window.confirm(`Supprimer l'auteur "${row.name}" ?`)) return;

    setDeletingId(row.id);
    await fetch(`/api/admin/authors/${row.id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div>
      <div className={listStyles.header}>
        <div>
          <h1 className={listStyles.pageTitle}>Auteurs</h1>
          <p className={listStyles.pageSubtitle}>
            Collection <span>authors</span> — les rédacteurs du blog.
          </p>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setFormOpen((v) => !v)}
        >
          {formOpen ? "Fermer" : "Ajouter un auteur"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {formOpen && (
        <form className={styles.form} onSubmit={handleCreate}>
          <div className={styles.formRow}>
            <button
              type="button"
              className={styles.avatarPicker}
              onClick={() => fileInputRef.current?.click()}
            >
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="" className={styles.avatarPreview} />
              ) : (
                <span className={styles.avatarPlaceholder}>{uploading ? "…" : "Photo"}</span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
            <div className={styles.formFields}>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nom"
                required
              />
              <input
                className={styles.input}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email (optionnel)"
                type="email"
              />
            </div>
          </div>
          <textarea
            className={styles.textarea}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Bio (optionnel)"
            rows={3}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={creating || !form.name.trim()}>
              {creating ? "…" : "Créer"}
            </button>
          </div>
        </form>
      )}

      <div className={listStyles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Auteur</span>
          <span>Email</span>
          <span>Actions</span>
        </div>

        {authors.map((row) => {
          const isEditing = editingId === row.id;
          return (
            <div key={row.id} className={styles.tableRow}>
              {isEditing ? (
                <div className={styles.formRow}>
                  <button
                    type="button"
                    className={styles.avatarPicker}
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    {editForm.avatarUrl ? (
                      <img src={editForm.avatarUrl} alt="" className={styles.avatarPreview} />
                    ) : (
                      <span className={styles.avatarPlaceholder}>{uploading ? "…" : "Photo"}</span>
                    )}
                  </button>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleEditAvatarChange}
                    disabled={uploading}
                  />
                  <div className={styles.formFields}>
                    <input
                      className={styles.input}
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      autoFocus
                    />
                    <input
                      className={styles.input}
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.nameCell}>
                  {row.avatarUrl ? (
                    <img src={row.avatarUrl} alt="" className={styles.avatarThumb} />
                  ) : (
                    <span className={styles.avatarThumbPlaceholder}>{row.name.slice(0, 1).toUpperCase()}</span>
                  )}
                  <div>
                    <div className={styles.name}>{row.name}</div>
                    <div className={listStyles.slugLine}>{row.slug}</div>
                  </div>
                </div>
              )}
              <span className={isEditing ? undefined : styles.emailCell}>
                {isEditing ? "" : row.email || "—"}
              </span>
              <div className={listStyles.actionsCell}>
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className={listStyles.editLink}
                      onClick={() => saveEdit(row.id)}
                      disabled={savingId === row.id}
                    >
                      {savingId === row.id ? "…" : "Enregistrer"}
                    </button>
                    <button type="button" className={listStyles.deleteButton} onClick={cancelEdit}>
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={listStyles.editLink} onClick={() => startEdit(row)}>
                      Modifier
                    </button>
                    <button
                      type="button"
                      className={listStyles.deleteButton}
                      onClick={() => handleDelete(row)}
                      disabled={deletingId === row.id}
                    >
                      {deletingId === row.id ? "…" : "✕"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {authors.length === 0 && (
          <div className={listStyles.empty}>
            <div className={listStyles.emptyTitle}>Aucun auteur</div>
            <div className={listStyles.emptyText}>Ajoutez votre premier auteur ci-dessus.</div>
          </div>
        )}
      </div>
    </div>
  );
}
