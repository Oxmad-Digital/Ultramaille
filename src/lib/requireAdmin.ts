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
