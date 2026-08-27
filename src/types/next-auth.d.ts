import type { DefaultSession } from "next-auth";
import type { AdminRole } from "@/models/Admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: AdminRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: AdminRole;
  }
}
