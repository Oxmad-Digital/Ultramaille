"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/blog/ArticleTable.module.css";

export default function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Supprimer l'article "${title}" ?`)) return;
    setLoading(true);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={loading}>
      {loading ? "..." : "Supprimer"}
    </button>
  );
}
