import { requirePageSession } from "@/lib/requireAdmin";
import { categories } from "@/lib/repositories/categories";
import { authors } from "@/lib/repositories/authors";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await requirePageSession();
  const [categoryList, authorList] = await Promise.all([categories.findAll(), authors.findAll()]);

  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm
        categories={categoryList.map((c) => c.name)}
        authors={authorList.map((a) => ({ id: a.id, name: a.name }))}
      />
    </AdminShell>
  );
}
