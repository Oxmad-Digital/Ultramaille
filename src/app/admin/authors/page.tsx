import { connectDB } from "@/lib/db";
import Author from "@/models/Author";
import AdminShell from "@/components/admin/AdminShell";
import AuthorAdminList, { type AdminAuthorRow } from "@/components/admin/AuthorAdminList";

export const dynamic = "force-dynamic";

async function getAuthors(): Promise<AdminAuthorRow[]> {
  await connectDB();
  const authors = await Author.find({}).sort({ name: 1 }).lean();
  return authors.map((a) => ({
    id: a._id.toString(),
    name: a.name,
    slug: a.slug,
    email: a.email,
    bio: a.bio,
    avatarUrl: a.avatarUrl,
    avatarPublicId: a.avatarPublicId,
  }));
}

export default async function AdminAuthorsPage() {
  const authors = await getAuthors();
  return (
    <AdminShell crumb="Auteurs" showNewButton={false}>
      <AuthorAdminList initialAuthors={authors} />
    </AdminShell>
  );
}
