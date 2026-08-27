"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./AdminShell.module.css";

type NavItem = { label: string; href: string; crumbs: string[] };

export default function AdminShellChrome({
  crumb,
  navItems,
  navCounts,
  email,
  initials,
  showNewButton,
  children,
}: {
  crumb: string;
  navItems: NavItem[];
  navCounts: Record<string, number>;
  email: string;
  initials: string;
  showNewButton: boolean;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className={`${styles.shell} ${menuOpen ? styles.menuOpen : ""}`}>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/ultramaille-logo.svg" alt="Ultramaille" className={styles.logo} />
          <div className={styles.brandTag}>Administration</div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroupLabel}>Contenu</div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${item.crumbs.includes(crumb) ? styles.navItemActive : ""}`}
            >
              <span>{item.label}</span>
              {navCounts[item.label] !== undefined && (
                <span className={styles.navBadge}>{navCounts[item.label]}</span>
              )}
            </Link>
          ))}

          <div className={`${styles.navGroupLabel} ${styles.spaced}`}>Système</div>
          <Link href="/blog" className={styles.navItem}>
            Voir le site →
          </Link>
          <LogoutButton className={styles.navButton} />
        </nav>

        <div className={styles.profile}>
          <div className={styles.profileRow}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.profileText}>
              <div className={styles.profileEmail}>{email || "Admin"}</div>
              <div className={styles.profileRole}>Éditeur</div>
            </div>
          </div>
          <div className={styles.profileMeta}>next.js · mongodb atlas</div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuToggleBar} />
            <span className={styles.menuToggleBar} />
            <span className={styles.menuToggleBar} />
          </button>
          <div className={styles.crumbs}>
            <span>Admin</span>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{crumb}</span>
          </div>
          {showNewButton && (
            <Link href="/admin/blog/new" className={styles.newButton}>
              <svg
                className={styles.newButtonIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.24 3.76a1 1 0 0 1 0 1.41l-10.6 10.6a6 6 0 0 1-2.83 1.57l-3.2.8.8-3.2a6 6 0 0 1 1.57-2.83l10.6-10.6a1 1 0 0 1 1.41 0Z" />
                <path d="M11 4H8a4 4 0 0 0-4 4v10a2 2 0 0 0 2 2h10a4 4 0 0 0 4-4v-3" />
              </svg>
              <span>Nouvel article</span>
            </Link>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
