import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  return session ?? null;
}
