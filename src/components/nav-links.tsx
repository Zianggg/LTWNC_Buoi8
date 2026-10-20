"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng chính" className="flex items-center gap-1 text-sm">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              active ? "bg-foreground text-background" : "text-muted hover:bg-border/60 hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
