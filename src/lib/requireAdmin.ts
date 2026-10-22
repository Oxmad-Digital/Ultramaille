import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isValidId } from "@/lib/http";
import { admins } from "@/lib/repositories/admins";

// Le JWT de session reste valide jusqu'à son expiration : un compte supprimé ou
// rétrogradé garderait son accès. On revérifie donc l'utilisateur en base à chaque
// appel et on prend le rôle courant, pas celui figé dans le token.
// cache() évite le double aller-retour quand la page et AdminShell l'appellent.
const getSessionState = cache(async () => {
  const session = await auth();
  if (!session) return { status: "anonymous" as const };

  const id = session.user?.id;
  // Un ancien ObjectId Mongo (sessions d'avant la migration) n'est pas un uuid : session périmée.
  if (!id || !isValidId(id)) return { status: "stale" as const };

  const role = await admins.findRoleById(id);
  if (!role) return { status: "stale" as const };

  session.user.role = role;
  return { status: "valid" as const, session };
});

export async function getSessionStatus() {
  return (await getSessionState()).status;
}

export async function requireAdmin() {
  const state = await getSessionState();
  return state.status === "valid" ? state.session : null;
}

export async function requireAdminRole() {
  const session = await requireAdmin();
  return session?.user.role === "admin" ? session : null;
}

// Garde pour les pages admin (Server Components). Le proxy filtre déjà /admin,
// mais une page qui lit la base ne doit pas dépendre uniquement de lui.
export async function requirePageSession() {
  const state = await getSessionState();
  if (state.status === "anonymous") redirect("/admin/login");
  // Cookie de session encore valide mais compte disparu : on passe par une route
  // qui le supprime, sinon /admin/login (proxy) renverrait vers /admin/blog en boucle.
  if (state.status === "stale") redirect("/api/auth/stale-session");
  return state.session;
}
