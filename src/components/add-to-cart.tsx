"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { can } from "@/lib/permissions";

/** Ẩn/hiện nút theo vai trò chỉ để tiện người dùng — không phải lớp bảo mật. */
export function AddToCart({ productName, disabled }: { productName: string; disabled: boolean }) {
  const { data: session, status } = useSession();
  const [added, setAdded] = useState(false);

  if (status === "loading") return <div className="mt-6 h-10 w-44 animate-pulse rounded-md bg-border/70" />;

  if (!can(session?.user.role, "cart:add")) {
    return (
      <Link
        href="/login"
        className="mt-6 inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium hover:border-foreground"
      >
        Đăng nhập để mua hàng
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || added}
      onClick={() => setAdded(true)}
      className="mt-6 h-10 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-60"
      aria-live="polite"
    >
      {added ? `Đã thêm "${productName}"` : "Thêm vào giỏ hàng"}
    </button>
  );
}
