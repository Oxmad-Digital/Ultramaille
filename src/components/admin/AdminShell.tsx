import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import LogoutButton from "./LogoutButton";
import styles from "./AdminShell.module.css";

const INERT_NAV_ITEMS = ["Catégories", "Médias", "Newsletter", "Auteurs"];

export default async function AdminShell({
  crumb,
  children,
}: {
  crumb: string;
  children: ReactNode;
}) {
  const session = await auth();
  await connectDB();
  const articleCount = await Article.countDocuments();

  const email = session?.user?.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "?";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/ultramaille-logo.svg" alt="Ultramaille" className={styles.logo} />
          <div className={styles.brandTag}>Administration</div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroupLabel}>Contenu</div>
          <Link href="/admin/blog" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span>Articles</span>
            <span className={styles.navBadge}>{articleCount}</span>
          </Link>
          {INERT_NAV_ITEMS.map((label) => (
            <div key={label} className={`${styles.navItem} ${styles.navItemInert}`}>
              <span>{label}</span>
              <span className={styles.navBadgeMuted}>Bientôt</span>
            </div>
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
          <div className={styles.crumbs}>
            <span>Admin</span>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{crumb}</span>
          </div>
          <Link href="/admin/blog/new" className={styles.newButton}>
            + Nouvel article
          </Link>
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
