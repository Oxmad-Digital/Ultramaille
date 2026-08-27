import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell crumb="Paramètres" showNewButton={false}>
      <SettingsForm
        initialMaintenanceMode={settings.maintenanceMode}
        initialMaintenanceMessage={settings.maintenanceMessage}
      />
    </AdminShell>
  );
}
