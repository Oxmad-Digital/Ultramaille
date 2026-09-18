import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getSessionStatus } from "@/lib/requireAdmin";

// Ferme une session dont le compte n'existe plus. Ne déconnecte que dans ce cas
// précis, pour qu'un lien externe ne puisse pas servir à déconnecter un admin.
export async function GET() {
  if ((await getSessionStatus()) === "stale") {
    await signOut({ redirectTo: "/admin/login" });
  }
  redirect("/admin/login");
}
