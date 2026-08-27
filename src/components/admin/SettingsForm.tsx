"use client";

import { useState } from "react";
import listStyles from "./ArticleAdminList.module.css";
import styles from "./SettingsForm.module.css";

export default function SettingsForm({
  initialMaintenanceMode,
  initialMaintenanceMessage,
}: {
  initialMaintenanceMode: boolean;
  initialMaintenanceMessage: string;
}) {
  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
  const [message, setMessage] = useState(initialMaintenanceMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(next: { maintenanceMode: boolean; maintenanceMessage: string }) {
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'enregistrement");
      setSaving(false);
      return;
    }

    setMaintenanceMode(data.maintenanceMode);
    setMessage(data.maintenanceMessage);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleToggle() {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    save({ maintenanceMode: next, maintenanceMessage: message });
  }

  function handleMessageSave(e: React.FormEvent) {
    e.preventDefault();
    save({ maintenanceMode, maintenanceMessage: message });
  }

  return (
    <div>
      <div className={listStyles.header}>
        <div>
          <h1 className={listStyles.pageTitle}>Paramètres</h1>
          <p className={listStyles.pageSubtitle}>
            Réglages généraux du site — <span>collection settings</span>.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <div className={styles.cardText}>
            <h2 className={styles.cardTitle}>Écran de maintenance</h2>
            <p className={styles.cardDescription}>
              Lorsqu&rsquo;il est activé, les visiteurs voient une page &laquo; site en travaux &raquo;
              à la place du site public. Vous restez connecté et pouvez continuer à naviguer normalement.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={maintenanceMode}
            className={`${styles.toggle} ${maintenanceMode ? styles.toggleOn : ""}`}
            onClick={handleToggle}
            disabled={saving}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>

        <div className={styles.statusRow}>
          <span className={`${styles.statusDot} ${maintenanceMode ? styles.statusDotOn : ""}`} />
          <span>{maintenanceMode ? "Site en maintenance" : "Site en ligne"}</span>
        </div>

        <form className={styles.messageForm} onSubmit={handleMessageSave}>
          <label className={styles.label} htmlFor="maintenanceMessage">
            Message affiché aux visiteurs (optionnel)
          </label>
          <textarea
            id="maintenanceMessage"
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Le site est actuellement en travaux. Merci de repasser bientôt."
            rows={4}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer le message"}
            </button>
            {saved && <span className={styles.savedNote}>Enregistré ✓</span>}
          </div>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
