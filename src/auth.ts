import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Configuration admin manquante");
        }

        if (credentials?.email !== adminEmail) {
          throw new Error("Identifiants invalides");
        }

        const ok = await bcrypt.compare(
          (credentials?.password as string) ?? "",
          adminPasswordHash
        );
        if (!ok) {
          throw new Error("Identifiants invalides");
        }

        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },
});
