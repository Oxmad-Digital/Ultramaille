import type { ReactNode } from "react";
import { requirePageSession } from "@/lib/requireAdmin";
import { articles } from "@/lib/repositories/articles";
import { categories } from "@/lib/repositories/categories";
import { media } from "@/lib/repositories/media";
import { authors } from "@/lib/repositories/authors";
import AdminShellChrome from "./AdminShellChrome";

const NAV_ITEMS = [
  { label: "Articles", href: "/admin/blog", crumbs: ["Articles", "Éditeur"] },
  { label: "Catégories", href: "/admin/categories", crumbs: ["Catégories"] },
  { label: "Médias", href: "/admin/media", crumbs: ["Médias"] },
  { label: "Auteurs", href: "/admin/authors", crumbs: ["Auteurs"] },
  { label: "Statistiques", href: "/admin/stats", crumbs: ["Statistiques"] },
  { label: "Paramètres", href: "/admin/settings", crumbs: ["Paramètres"] },
];

export default async function AdminShell({
  crumb,
  children,
  showNewButton = true,
}: {
  crumb: string;
  children: ReactNode;
  showNewButton?: boolean;
}) {
  const session = await requirePageSession();
  const [articleCount, categoryCount, mediaCount, authorCount] = await Promise.all([
    articles.count(),
    categories.count(),
    media.count(),
    authors.count(),
  ]);
  const navCounts: Record<string, number> = {
    Articles: articleCount,
    Catégories: categoryCount,
    Médias: mediaCount,
    Auteurs: authorCount,
  };

  const email = session.user.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "?";
  const role = session.user.role;

  return (
    <AdminShellChrome
      crumb={crumb}
      navItems={NAV_ITEMS}
      navCounts={navCounts}
      email={email}
      initials={initials}
      roleLabel={role === "admin" ? "Administrateur" : "Membre"}
      showNewButton={showNewButton}
    >
      {children}
    </AdminShellChrome>
  );
}
