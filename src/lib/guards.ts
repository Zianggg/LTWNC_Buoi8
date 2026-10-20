import "server-only";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can, type Action } from "@/lib/permissions";

/**
 * Lớp 2 — dùng trong page (Server Component): chưa đăng nhập → /login (401),
 * đăng nhập nhưng thiếu quyền → /403.
 */
export async function requirePermission(action: Action, callbackUrl: string): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if (!can(session.user.role, action)) redirect("/403");
  return session;
}
