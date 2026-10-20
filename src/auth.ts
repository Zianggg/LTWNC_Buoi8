import NextAuth, { CredentialsSignin } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { isLocked, LIMITS, recordFailure, resetFailures } from "@/lib/rate-limit";
import { verifyUser } from "@/lib/users";

class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

const LoginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(6).max(128),
});

// Login GitHub nằm trong danh sách này được cấp vai trò admin, còn lại là user.
const adminGithubLogins = (process.env.ADMIN_GITHUB_LOGINS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const githubEnabled = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(raw, request) {
      const parsed = LoginSchema.safeParse(raw);
      if (!parsed.success) return null;
      const { email, password } = parsed.data;
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
      const accountKey = `acc:${email.toLowerCase()}|${ip}`;
      const ipKey = `ip:${ip}`;

      if (isLocked(accountKey, LIMITS.account) || isLocked(ipKey, LIMITS.ip)) throw new RateLimitedError();
      const user = await verifyUser(email, password);
      if (!user) {
        recordFailure(accountKey);
        recordFailure(ipKey);
        return null;
      }
      resetFailures(accountKey);
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  }),
];

if (githubEnabled) {
  providers.push(
    GitHub({
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: adminGithubLogins.includes(profile.login.toLowerCase()) ? "admin" : "user",
        };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
});
