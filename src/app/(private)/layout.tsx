import type { Metadata } from "next";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { RoleBadge } from "@/components/role-badge";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { logout } from "@/app/(public)/login/actions";
import { can } from "@/lib/permissions";

// Trang riêng tư: không lập chỉ mục.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Header là Server Component: auth() đọc phiên từ cookie ngay trên server (không nháy giao diện).
 * Layout KHÔNG phải lớp phân quyền — layout không render lại khi chuyển trang con,
 * nên mỗi page vẫn tự kiểm tra bằng requirePermission().
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = session?.user;

  const nav = [
    { href: "/", label: "Cửa hàng" },
    { href: "/dashboard", label: "Dashboard" },
    ...(can(user?.role, "admin:access") ? [{ href: "/admin", label: "Quản trị" }] : []),
  ];

  return (
    <>
      <SiteHeader
        nav={nav}
        right={
          user ? (
            <div className="flex h-8 items-center gap-2 text-sm">
              <span className="max-w-40 truncate">
                Xin chào, <span className="font-medium">{user.name ?? user.email}</span>
              </span>
              <RoleBadge role={user.role} />
              <form action={logout}>
                <button type="submit" className="rounded-md border border-border px-2 py-1 text-muted hover:text-foreground">
                  Đăng xuất
                </button>
              </form>
            </div>
          ) : null
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </>
  );
}
