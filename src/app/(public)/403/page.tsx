import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "403 — Không có quyền", robots: { index: false, follow: false } };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-5xl font-bold">403</p>
      <h1 className="mt-2 text-lg font-medium">Bạn không có quyền truy cập trang này</h1>
      <p className="mt-2 text-sm text-muted">
        Bạn đã đăng nhập nhưng vai trò hiện tại không đủ quyền. Hãy đăng nhập bằng tài khoản quản trị.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/dashboard" className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
          Về Dashboard
        </Link>
        <Link href="/login?callbackUrl=/admin" className="rounded-md border border-border px-4 py-2 text-sm">
          Đổi tài khoản
        </Link>
      </div>
    </div>
  );
}
