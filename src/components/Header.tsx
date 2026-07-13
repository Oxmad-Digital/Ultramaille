"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", fr: "Accueil", en: "Home" },
  { href: "/a-propos", fr: "À propos", en: "About" },
  { href: "/notre-expertise", fr: "Notre expertise", en: "Our expertise" },
  { href: "/notre-engagement", fr: "Notre engagement", en: "Our commitment" },
  { href: "/contact", fr: "Contact", en: "Contact" },
];

export default function Header({ ctaHref = "#contact" }: { ctaHref?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <Link href="/" className={styles.logoLink}>
        <img src="/ultramaille-logo.svg" alt="Ultramaille" className={styles.logo} />
      </Link>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ""}`}
          >
            {t(item.fr, item.en)}
          </Link>
        ))}
      </nav>
      <div className={styles.right}>
        <div className={styles.langSwitch}>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`${styles.langButton} ${lang === "fr" ? styles.langButtonActive : ""}`}
          >
            FR
          </button>
          <span className={styles.langSep}>/</span>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`${styles.langButton} ${lang === "en" ? styles.langButtonActive : ""}`}
          >
            EN
          </button>
        </div>
        <a href={ctaHref} className={styles.cta}>
          {t("Travailler avec nous", "Work with us")}
        </a>
      </div>
    </header>
  );
}
