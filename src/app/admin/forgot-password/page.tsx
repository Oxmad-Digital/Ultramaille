"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../login/Login.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || data.error || "Une erreur est survenue");
  }

  return (
    <main className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Mot de passe oublié</h1>
        <p className={styles.subtitle}>
          Entrez votre email admin, un lien de réinitialisation vous sera envoyé.
        </p>

        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        {message && <p className={styles.error}>{message}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Envoi..." : "Envoyer le lien"}
        </button>

        <Link href="/admin/login" className={styles.forgotLink}>
          Retour à la connexion
        </Link>
      </form>
    </main>
  );
}
