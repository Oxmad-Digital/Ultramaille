"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import styles from "./Footer.module.css";

const NAV_ITEMS = [
  { href: "/", fr: "Accueil", en: "Home" },
  { href: "/a-propos", fr: "À propos", en: "About" },
  { href: "/notre-expertise", fr: "Notre expertise", en: "Our expertise" },
  { href: "/notre-engagement", fr: "Notre engagement", en: "Our commitment" },
  { href: "/contact", fr: "Contact", en: "Contact" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <img src="/ultramaille-logo.svg" alt="Ultramaille" className={styles.logo} />
            <p className={styles.tagline}>
              {t(
                "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
                "Knitwear specialists in Antananarivo, Madagascar. Tricot, crochet and embroidery for the world's leading fashion houses.",
              )}
            </p>
          </div>
          <div>
            <div className={styles.colTitle}>{t("Navigation", "Navigation")}</div>
            <div className={styles.navCol}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={styles.link}>
                  {t(item.fr, item.en)}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.colTitle}>{t("Contact", "Contact")}</div>
            <div className={styles.contactCol}>
              <span>
                Lot II G 55 ter NBA Ambatomaro
                <br />
                Antananarivo, Madagascar
              </span>
              <a href="tel:+261341185522" className={styles.link}>
                +261 34 11 855 22
              </a>
              <a href="mailto:contact@ultramaille.com" className={styles.link}>
                contact@ultramaille.com
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.bottomText}>
            © 2026 ULTRAMAILLE S.A — {t("Tous droits réservés", "All rights reserved")}
          </span>
          <span className={styles.bottomText}>Antananarivo, Madagascar</span>
        </div>
      </div>
    </footer>
  );
}
