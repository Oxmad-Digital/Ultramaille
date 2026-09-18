import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

class RateLimitedSignin extends CredentialsSignin {
  code = "rate_limited";
}

const LOGIN_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };

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
      async authorize(credentials, request) {
        const rawEmail = credentials?.email;
        const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";
        if (!email) {
          throw new CredentialsSignin();
        }

        // Limite par IP (force brute depuis une source) et par compte
        // (force brute distribuée sur un même email).
        const [ipOk, emailOk] = await Promise.all([
          rateLimit("login-ip", getClientIp(request.headers), LOGIN_LIMIT),
          rateLimit("login-email", email, LOGIN_LIMIT),
        ]);
        if (!ipOk || !emailOk) {
          throw new RateLimitedSignin();
        }

        await connectDB();
        const admin = await Admin.findOne({ email });
        if (!admin) {
          throw new CredentialsSignin();
        }

        const ok = await bcrypt.compare(
          (credentials?.password as string) ?? "",
          admin.passwordHash
        );
        if (!ok) {
          throw new CredentialsSignin();
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
