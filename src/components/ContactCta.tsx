"use client";

import { useLanguage } from "@/lib/language-context";
import styles from "./ContactCta.module.css";

export default function ContactCta() {
  const { t } = useLanguage();

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <div className={styles.eyebrow}>{t("— Travaillons ensemble", "— Let's talk")}</div>
          <h2 className={styles.title}>
            {t("Donnons vie à vos collections.", "Let's bring your collections to life.")}
          </h2>
          <p className={styles.text}>
            {t(
              "Parlez-nous de votre projet — notre équipe vous répond sous 24h avec une proposition adaptée à vos besoins.",
              "Tell us about your project — our team replies within 24h with a proposal tailored to your needs.",
            )}
          </p>
          <a href="mailto:contact@ultramaille.com" className={styles.button}>
            {t("Nous contacter →", "Contact us →")}
          </a>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>{t("Adresse", "Address")}</div>
            <div className={styles.infoValue}>
              Lot II G 55 ter NBA Ambatomaro
              <br />
              BP 3298 — Antananarivo, Madagascar
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>{t("Téléphone", "Phone")}</div>
            <a href="tel:+261341185522" className={styles.infoLink}>
              +261 34 11 855 22
            </a>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Email</div>
            <a href="mailto:contact@ultramaille.com" className={styles.infoLink}>
              contact@ultramaille.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
