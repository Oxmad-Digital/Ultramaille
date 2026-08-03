"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordField from "@/components/admin/PasswordField";
import styles from "../login/Login.module.css";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  if (!token) {
    return (
      <main className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Lien invalide</h1>
          <p className={styles.subtitle}>
            Ce lien de réinitialisation est incomplet. Demandez-en un nouveau depuis la page de
            connexion.
          </p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Mot de passe modifié</h1>
          <p className={styles.subtitle}>Redirection vers la connexion...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Nouveau mot de passe</h1>
        <p className={styles.subtitle}>Choisissez un nouveau mot de passe admin.</p>

        <label className={styles.label} htmlFor="password">
          Nouveau mot de passe
        </label>
        <PasswordField
          id="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        <label className={styles.label} htmlFor="confirmPassword">
          Confirmer le mot de passe
        </label>
        <PasswordField
          id="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </main>
  );
}
