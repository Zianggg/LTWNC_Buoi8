import Link from "next/link";
import type { ReactNode } from "react";
import { CATEGORIES, type Category } from "@/lib/products";

// Layout lồng: sidebar giữ nguyên khi chuyển giữa /products và /products/[id].
export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <aside className="md:w-48 md:shrink-0">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Danh mục</h2>
        <ul className="flex gap-2 text-sm md:flex-col md:gap-1">
          <li>
            <Link href="/products" className="block rounded-md px-2 py-1 hover:bg-border/60">
              Tất cả
            </Link>
          </li>
          {(Object.keys(CATEGORIES) as Category[]).map((c) => (
            <li key={c}>
              <Link href={`/products#${c}`} className="block rounded-md px-2 py-1 hover:bg-border/60">
                {CATEGORIES[c]}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
