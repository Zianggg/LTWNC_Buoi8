import type { DefaultSession } from "next-auth";
import type { SessionRole } from "@/lib/permissions";

declare module "next-auth" {
  interface User {
    role: SessionRole;
  }
  interface Session {
    user: { id: string; role: SessionRole } & DefaultSession["user"];
  }
}

// next-auth/jwt chỉ re-export từ @auth/core/jwt nên phải mở rộng ở module gốc.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: SessionRole;
  }
}
