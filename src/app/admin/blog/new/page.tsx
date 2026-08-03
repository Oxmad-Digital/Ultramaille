import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <AdminShell crumb="Éditeur">
      <ArticleForm />
    </AdminShell>
  );
}
