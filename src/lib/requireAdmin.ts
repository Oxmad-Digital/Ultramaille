import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  return session ?? null;
}

export async function requireAdminRole() {
  const session = await auth();
  if (session?.user?.role !== "admin") return null;
  return session;
}

// Garde pour les pages admin (Server Components). Le proxy filtre déjà /admin,
// mais une page qui lit la base ne doit pas dépendre uniquement de lui.
export async function requirePageSession() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return session;
}
