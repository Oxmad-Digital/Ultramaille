import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

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
        const email = (credentials?.email as string)?.toLowerCase().trim();
        if (!email) {
          throw new Error("Identifiants invalides");
        }

        await connectDB();
        const admin = await Admin.findOne({ email });
        if (!admin) {
          throw new Error("Identifiants invalides");
        }

        const ok = await bcrypt.compare(
          (credentials?.password as string) ?? "",
          admin.passwordHash
        );
        if (!ok) {
          throw new Error("Identifiants invalides");
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: "Admin",
          role: admin.role ?? "admin",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },
});
