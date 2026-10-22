import { requirePageSession } from "@/lib/requireAdmin";
import { admins } from "@/lib/repositories/admins";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import UserAdminList, { type AdminUserRow } from "@/components/admin/UserAdminList";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function getUsers(): Promise<AdminUserRow[]> {
  const users = await admins.findAll();
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    invitePending: u.invitePending,
  }));
}

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([getSiteSettings(), requirePageSession()]);
  const isAdmin = session.user.role === "admin";
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
