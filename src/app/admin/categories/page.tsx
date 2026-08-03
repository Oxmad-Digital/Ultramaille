import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Article from "@/models/Article";
import AdminShell from "@/components/admin/AdminShell";
import CategoryAdminList, { type AdminCategoryRow } from "@/components/admin/CategoryAdminList";

export const dynamic = "force-dynamic";

async function getCategories(): Promise<AdminCategoryRow[]> {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  const counts = await Article.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const countMap = new Map(counts.map((c) => [c._id as string, c.count as number]));

  return categories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    articleCount: countMap.get(c.name) ?? 0,
  }));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <AdminShell crumb="Catégories" showNewButton={false}>
      <CategoryAdminList initialCategories={categories} />
    </AdminShell>
  );
}
