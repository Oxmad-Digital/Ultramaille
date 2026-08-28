"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { CONTACT } from "@/lib/site";
import styles from "./Footer.module.css";

const NAV_ITEMS = [
  { href: "/", fr: "Accueil", en: "Home" },
  { href: "/a-propos", fr: "À propos", en: "About" },
  { href: "/notre-expertise", fr: "Notre expertise", en: "Our expertise" },
  { href: "/notre-engagement", fr: "Notre engagement", en: "Our commitment" },
  { href: "/blog", fr: "Blog", en: "Blog" },
  { href: "/contact", fr: "Contact", en: "Contact" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <Image src="/ultramaille-logo-mark.webp" alt="Ultramaille" width={40} height={40} className={styles.logo} />
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
                {CONTACT.streetAddress}
                <br />
                {CONTACT.addressLocality}, Madagascar
              </span>
              <a href={`tel:${CONTACT.telephone}`} className={styles.link}>
                {CONTACT.telephoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className={styles.link}>
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.bottomText}>
            © 2026 ULTRAMAILLE S.A — {t("Tous droits réservés", "All rights reserved")}
          </span>
          <div className={styles.bottomRight}>
            <span className={styles.bottomText}>Antananarivo, Madagascar</span>
            <Link href="/mentions-legales" className={styles.bottomLink}>
              {t("Mentions légales", "Legal notice")}
            </Link>
            <Link href="/admin/login" className={styles.bottomLink}>
              {t("Espace admin", "Admin area")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
