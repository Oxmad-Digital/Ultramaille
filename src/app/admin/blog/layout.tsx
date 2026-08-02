import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "@/components/admin/AdminBar.module.css";

export default function AdminBlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.bar}>
        <Link href="/admin/blog" className={styles.brand}>
          Ultramaille — Admin blog
        </Link>
        <nav className={styles.nav}>
          <Link href="/admin/blog/new" className={styles.navLink}>
            Nouvel article
          </Link>
          <Link href="/blog" className={styles.navLink}>
            Voir le blog
          </Link>
          <LogoutButton />
        </nav>
      </div>
      <div className={styles.content}>{children}</div>
    </>
  );
}
