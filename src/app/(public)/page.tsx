import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/product-card";
import { CATEGORIES, getProducts, type Category } from "@/lib/products";
import { absoluteUrl, OG_BASE, SEO_ENHANCED, SITE } from "@/lib/site";

// SSG: không đọc cookie/searchParams → render 1 lần lúc build; admin xoá sản phẩm thì revalidatePath("/").
export const metadata: Metadata = SEO_ENHANCED
  ? {
      title: { absolute: `${SITE.name} — Giày & phụ kiện thể thao` },
      alternates: { canonical: "/", languages: { "vi-VN": "/" } },
      openGraph: { ...OG_BASE, url: "/", title: SITE.name, description: SITE.description },
    }
  : {};

export default async function HomePage() {
  const products = await getProducts();
  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      <section className="mb-12 rounded-2xl bg-foreground px-6 py-12 text-background sm:px-10">
        <p className="text-sm font-medium text-accent">Mùa giải 2026</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Giày và phụ kiện thể thao cho mọi sân chơi
        </h1>
        <p className="mt-3 max-w-xl text-background/70">
          {products.length} sản phẩm giày nam, giày nữ và dụng cụ thể thao. Đăng nhập để thêm vào giỏ và theo dõi đơn hàng.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/products" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            Xem sản phẩm
          </Link>
          <Link href="/login" className="rounded-md border border-background/30 px-4 py-2 text-sm font-medium">
            Đăng nhập
          </Link>
        </div>
      </section>

      <section aria-labelledby="featured" className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="featured" className="text-xl font-bold">
            Được đánh giá cao
          </h2>
          <Link href="/products" className="text-sm text-muted hover:text-foreground hover:underline">
            Tất cả sản phẩm →
          </Link>
        </div>
        <ProductGrid products={featured} priorityCount={4} />
      </section>

      <section aria-labelledby="categories">
        <h2 id="categories" className="mb-4 text-xl font-bold">
          Danh mục
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {(Object.keys(CATEGORIES) as Category[]).map((c) => (
            <li key={c}>
              <Link
                href={`/products#${c}`}
                className="block rounded-lg border border-border bg-card p-5 hover:border-foreground"
              >
                <span className="font-medium">{CATEGORIES[c]}</span>
                <span className="mt-1 block text-sm text-muted">
                  {products.filter((p) => p.category === c).length} sản phẩm
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          logo: absoluteUrl("/logo.png"),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          inLanguage: "vi-VN",
          potentialAction: {
            "@type": "SearchAction",
            target: `${absoluteUrl("/search")}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
    </>
  );
}
