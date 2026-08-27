import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import styles from "./Maintenance.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site en maintenance — Ultramaille",
  robots: { index: false, follow: false },
};

const DEFAULT_MESSAGE =
  "Notre site est actuellement en travaux pour vous offrir une meilleure expérience. Merci de repasser un peu plus tard.";

export default async function MaintenancePage() {
  const settings = await getSiteSettings();
  const message = settings.maintenanceMessage?.trim() || DEFAULT_MESSAGE;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src="/ultramaille-logo.svg" alt="Ultramaille" className={styles.logo} />
        <div className={styles.eyebrow}>Site en travaux</div>
        <h1 className={styles.title}>Nous préparons quelque chose de nouveau</h1>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
