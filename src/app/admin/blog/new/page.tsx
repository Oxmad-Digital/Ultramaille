import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm categories={categories.map((c) => c.name)} />
    </AdminShell>
  );
}
