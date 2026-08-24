import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Author from "@/models/Author";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  const authors = await Author.find({}).sort({ name: 1 }).lean();

  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm
        categories={categories.map((c) => c.name)}
        authors={authors.map((a) => ({ id: a._id.toString(), name: a.name }))}
      />
    </AdminShell>
  );
}
