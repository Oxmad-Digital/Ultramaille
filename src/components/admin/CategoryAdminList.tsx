"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import listStyles from "./ArticleAdminList.module.css";
import styles from "./CategoryAdminList.module.css";

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
};

export default function CategoryAdminList({
  initialCategories,
}: {
  initialCategories: AdminCategoryRow[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [prevInitialCategories, setPrevInitialCategories] = useState(initialCategories);
  if (initialCategories !== prevInitialCategories) {
    setPrevInitialCategories(initialCategories);
    setCategories(initialCategories);
  }

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setCreating(true);
    setError("");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erreur lors de la création");
      setCreating(false);
      return;
    }

    setNewName("");
    setCreating(false);
    router.refresh();
  }

  function startEdit(row: AdminCategoryRow) {
    setError("");
    setEditingId(row.id);
    setEditValue(row.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(id: string) {
    const name = editValue.trim();
    if (!name) return;

    setSavingId(id);
    setError("");

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erreur lors du renommage");
      setSavingId(null);
      return;
    }

    setSavingId(null);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(row: AdminCategoryRow) {
    const message =
      row.articleCount > 0
        ? `Supprimer la catégorie "${row.name}" ? ${row.articleCount} article${
            row.articleCount > 1 ? "s" : ""
          } passeront sans catégorie.`
        : `Supprimer la catégorie "${row.name}" ?`;
    if (!window.confirm(message)) return;

    setDeletingId(row.id);
    await fetch(`/api/admin/categories/${row.id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div>
      <div className={listStyles.header}>
        <div>
          <h1 className={listStyles.pageTitle}>Catégories</h1>
          <p className={listStyles.pageSubtitle}>
            Collection <span>categories</span> — utilisées pour classer les articles du blog.
          </p>
        </div>
        <form className={styles.addForm} onSubmit={handleCreate}>
          <input
            className={listStyles.search}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nouvelle catégorie…"
          />
          <button type="submit" className={styles.addButton} disabled={creating || !newName.trim()}>
            {creating ? "…" : "Ajouter"}
          </button>
        </form>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={listStyles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Nom</span>
          <span>Slug</span>
          <span>Articles</span>
          <span>Actions</span>
        </div>

        {categories.map((row) => {
          const isEditing = editingId === row.id;
          return (
            <div key={row.id} className={styles.tableRow}>
              {isEditing ? (
                <input
                  className={styles.editInput}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <span className={styles.nameCell}>{row.name}</span>
              )}
              <span className={styles.slugCell}>{row.slug}</span>
              <span className={styles.countCell}>{row.articleCount}</span>
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
                      Renommer
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

        {categories.length === 0 && (
          <div className={listStyles.empty}>
            <div className={listStyles.emptyTitle}>Aucune catégorie</div>
            <div className={listStyles.emptyText}>Ajoutez votre première catégorie ci-dessus.</div>
          </div>
        )}
      </div>
    </div>
  );
}
