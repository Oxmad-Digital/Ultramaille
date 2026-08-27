import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import UserAdminList, { type AdminUserRow } from "@/components/admin/UserAdminList";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function getUsers(): Promise<AdminUserRow[]> {
  await connectDB();
  const users = await Admin.find({}).sort({ email: 1 }).lean();
  return users.map((u) => ({
    id: u._id.toString(),
    email: u.email,
    role: u.role || "admin",
    invitePending: !!u.invitePending,
  }));
}

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([getSiteSettings(), auth()]);
  const isAdmin = session?.user?.role === "admin";
  const users = isAdmin ? await getUsers() : [];

  return (
    <AdminShell crumb="Paramètres" showNewButton={false}>
      <SettingsForm
        initialMaintenanceMode={settings.maintenanceMode}
        initialMaintenanceMessage={settings.maintenanceMessage}
      />
      {isAdmin && session?.user?.id && (
        <UserAdminList initialUsers={users} currentUserId={session.user.id} />
      )}
    </AdminShell>
  );
}
