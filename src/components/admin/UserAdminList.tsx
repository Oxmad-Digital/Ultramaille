"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import listStyles from "./ArticleAdminList.module.css";
import styles from "./UserAdminList.module.css";
import PasswordField from "./PasswordField";

export type AdminUserRow = {
  id: string;
  email: string;
  role: "admin" | "member";
};

const EMPTY_FORM = { email: "", password: "", role: "member" as "admin" | "member" };

export default function UserAdminList({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [prevInitialUsers, setPrevInitialUsers] = useState(initialUsers);
  if (initialUsers !== prevInitialUsers) {
    setPrevInitialUsers(initialUsers);
    setUsers(initialUsers);
  }

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<"admin" | "member">("member");
  const [editPassword, setEditPassword] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const email = form.email.trim();
    if (!email || form.password.length < 8) return;

    setCreating(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: form.password, role: form.role }),
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

  function startEdit(row: AdminUserRow) {
    setError("");
    setEditingId(row.id);
    setEditRole(row.role);
    setEditPassword("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditPassword("");
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    setError("");

    const body: { role: string; password?: string } = { role: editRole };
    if (editPassword) body.password = editPassword;

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erreur lors de la mise à jour");
      setSavingId(null);
      return;
    }

    setSavingId(null);
    setEditingId(null);
    setEditPassword("");
    router.refresh();
  }

  async function handleDelete(row: AdminUserRow) {
    if (!window.confirm(`Supprimer l'utilisateur "${row.email}" ?`)) return;

    setDeletingId(row.id);
    setError("");
    const res = await fetch(`/api/admin/users/${row.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Erreur lors de la suppression");
    }
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className={styles.section}>
      <div className={listStyles.header}>
        <div>
          <h2 className={listStyles.pageTitle}>Utilisateurs</h2>
          <p className={listStyles.pageSubtitle}>
            Collection <span>admins</span> — les comptes de l&apos;administration.
          </p>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setFormOpen((v) => !v)}
        >
          {formOpen ? "Fermer" : "Ajouter un utilisateur"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {formOpen && (
        <form className={styles.form} onSubmit={handleCreate}>
          <div className={styles.formFields}>
            <input
              className={styles.input}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              type="email"
              required
            />
            <PasswordField
              id="new-user-password"
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              autoComplete="new-password"
              placeholder="Mot de passe (8 caractères min.)"
              inputClassName={styles.input}
            />
            <select
              className={styles.select}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "member" }))}
            >
              <option value="member">Membre</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={creating || !form.email.trim() || form.password.length < 8}
            >
              {creating ? "…" : "Créer"}
            </button>
          </div>
        </form>
      )}

      <div className={listStyles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Email</span>
          <span>Rôle</span>
          <span>Actions</span>
        </div>

        {users.map((row) => {
          const isEditing = editingId === row.id;
          const isSelf = row.id === currentUserId;
          return (
            <div key={row.id} className={styles.tableRow}>
              <span className={styles.emailCell}>
                {row.email}
                {isSelf && <span className={styles.youBadge}>(vous)</span>}
              </span>

              {isEditing ? (
                <select
                  className={styles.select}
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "admin" | "member")}
                  disabled={isSelf}
                >
                  <option value="member">Membre</option>
                  <option value="admin">Administrateur</option>
                </select>
              ) : (
                <span
                  className={`${styles.roleBadge} ${
                    row.role === "admin" ? styles.roleAdmin : styles.roleMember
                  }`}
                >
                  {row.role === "admin" ? "Administrateur" : "Membre"}
                </span>
              )}

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
                      disabled={isSelf || deletingId === row.id}
                      title={isSelf ? "Vous ne pouvez pas supprimer votre propre compte" : undefined}
                    >
                      {deletingId === row.id ? "…" : "✕"}
                    </button>
                  </>
                )}
              </div>

              {isEditing && (
                <div className={styles.formFields} style={{ gridColumn: "1 / -1" }}>
                  <PasswordField
                    id={`edit-password-${row.id}`}
                    value={editPassword}
                    onChange={setEditPassword}
                    autoComplete="new-password"
                    placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
                    required={false}
                    inputClassName={styles.input}
                  />
                </div>
              )}
            </div>
          );
        })}

        {users.length === 0 && (
          <div className={listStyles.empty}>
            <div className={listStyles.emptyTitle}>Aucun utilisateur</div>
            <div className={listStyles.emptyText}>Ajoutez votre premier utilisateur ci-dessus.</div>
          </div>
        )}
      </div>
    </div>
  );
}
