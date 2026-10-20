import Link from "next/link";
import type { ReactNode } from "react";
import { NavLinks, type NavItem } from "@/components/nav-links";
import { SITE } from "@/lib/site";

export const PUBLIC_NAV: readonly NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/dashboard", label: "Tài khoản" },
];

/** Khung header dùng chung; phần bên phải (user) do layout truyền vào. */
export function SiteHeader({ nav, right }: { nav: readonly NavItem[]; right: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-base font-bold tracking-tight">
          {SITE.shortName}
        </Link>
        <NavLinks items={nav} />
        <form action="/search" role="search" className="ml-auto hidden md:block">
          <label htmlFor="q" className="sr-only">
            Tìm sản phẩm
          </label>
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Tìm giày, bóng…"
            className="h-8 w-48 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
          />
        </form>
        <div className="ml-auto md:ml-0">{right}</div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-muted">
        <p>
          {SITE.name} · LTWNC Buổi 8 · B23DCCC054
        </p>
        <nav aria-label="Liên kết cuối trang" className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">
            Giới thiệu
          </Link>
          <Link href="/products" className="hover:text-foreground">
            Sản phẩm
          </Link>
          <a href="/sitemap.xml" className="hover:text-foreground">
            Sitemap
          </a>
        </nav>
      </div>
    </footer>
  );
}
