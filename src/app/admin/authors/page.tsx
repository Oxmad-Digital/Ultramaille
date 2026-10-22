import { requirePageSession } from "@/lib/requireAdmin";
import { authors } from "@/lib/repositories/authors";
import AdminShell from "@/components/admin/AdminShell";
import AuthorAdminList, { type AdminAuthorRow } from "@/components/admin/AuthorAdminList";

export const dynamic = "force-dynamic";

async function getAuthors(): Promise<AdminAuthorRow[]> {
  const list = await authors.findAll();
  return list.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    email: a.email,
    bio: a.bio,
    avatarUrl: a.avatarUrl,
    avatarPublicId: a.avatarPublicId,
  }));
}

export default async function AdminAuthorsPage() {
  await requirePageSession();
  const authors = await getAuthors();
  return (
    <AdminShell crumb="Auteurs" showNewButton={false}>
      <AuthorAdminList initialAuthors={authors} />
    </AdminShell>
  );
}
