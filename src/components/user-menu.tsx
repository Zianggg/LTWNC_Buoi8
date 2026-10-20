"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { RoleBadge } from "@/components/role-badge";

/**
 * Header của trang công khai đọc phiên ở client (useSession) để các trang SSG/ISR
 * không phải gọi auth() — gọi auth() sẽ đọc cookie và biến trang thành dynamic.
 */
export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-36 animate-pulse rounded-md bg-border/70" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex h-8 items-center gap-2 text-sm">
      <Link href="/dashboard" className="flex items-center gap-2 hover:underline">
        <span className="max-w-32 truncate font-medium">{session.user.name}</span>
        <RoleBadge role={session.user.role} />
      </Link>
      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/" })}
        className="rounded-md border border-border px-2 py-1 text-muted hover:text-foreground"
      >
        Thoát
      </button>
    </div>
  );
}
