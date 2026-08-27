import type { ReactNode } from "react";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import Category from "@/models/Category";
import Media from "@/models/Media";
import Author from "@/models/Author";
import AdminShellChrome from "./AdminShellChrome";

const NAV_ITEMS = [
  { label: "Articles", href: "/admin/blog", crumbs: ["Articles", "Éditeur"] },
  { label: "Catégories", href: "/admin/categories", crumbs: ["Catégories"] },
  { label: "Médias", href: "/admin/media", crumbs: ["Médias"] },
  { label: "Auteurs", href: "/admin/authors", crumbs: ["Auteurs"] },
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
  const session = await auth();
  await connectDB();
  const articleCount = await Article.countDocuments();
  const categoryCount = await Category.countDocuments();
  const mediaCount = await Media.countDocuments();
  const authorCount = await Author.countDocuments();
  const navCounts: Record<string, number> = {
    Articles: articleCount,
    Catégories: categoryCount,
    Médias: mediaCount,
    Auteurs: authorCount,
  };

  const email = session?.user?.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "?";
  const role = session?.user?.role ?? "member";

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
