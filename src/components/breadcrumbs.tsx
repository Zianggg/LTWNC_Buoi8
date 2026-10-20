import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { name: string; href: string };

/** Breadcrumb hiển thị + JSON-LD BreadcrumbList cùng một nguồn dữ liệu. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>›</span>}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-foreground">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-foreground hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  );
}
