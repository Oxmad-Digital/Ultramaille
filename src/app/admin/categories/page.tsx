import { requirePageSession } from "@/lib/requireAdmin";
import { categories } from "@/lib/repositories/categories";
import { articles } from "@/lib/repositories/articles";
import AdminShell from "@/components/admin/AdminShell";
import CategoryAdminList, { type AdminCategoryRow } from "@/components/admin/CategoryAdminList";

export const dynamic = "force-dynamic";

async function getCategories(): Promise<AdminCategoryRow[]> {
  const [list, countMap] = await Promise.all([categories.findAll(), articles.countByCategory()]);

  return list.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    articleCount: countMap.get(c.name) ?? 0,
  }));
}

export default async function AdminCategoriesPage() {
  await requirePageSession();
  const categories = await getCategories();
  return (
    <AdminShell crumb="Catégories" showNewButton={false}>
      <CategoryAdminList initialCategories={categories} />
    </AdminShell>
  );
}
