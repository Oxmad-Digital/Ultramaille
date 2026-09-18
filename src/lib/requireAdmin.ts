import { cache } from "react";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

// Le JWT de session reste valide jusqu'à son expiration : un compte supprimé ou
// rétrogradé garderait son accès. On revérifie donc l'utilisateur en base à chaque
// appel et on prend le rôle courant, pas celui figé dans le token.
// cache() évite le double aller-retour quand la page et AdminShell l'appellent.
const getSessionState = cache(async () => {
  const session = await auth();
  if (!session) return { status: "anonymous" as const };

  const id = session.user?.id;
  if (!id || !mongoose.isValidObjectId(id)) return { status: "stale" as const };

  await connectDB();
  const admin = await Admin.findById(id).select("role").lean();
  if (!admin) return { status: "stale" as const };

  session.user.role = admin.role ?? "admin";
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
