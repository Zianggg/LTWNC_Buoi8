import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ProductGrid } from "@/components/product-card";
import { CATEGORIES, getProducts, type Category } from "@/lib/products";
import { absoluteUrl, OG_BASE, SEO_ENHANCED } from "@/lib/site";

// ISR: trang tĩnh, tạo lại nền sau tối đa 60 giây (hoặc ngay khi admin gọi revalidatePath).
export const revalidate = 60;

export const metadata: Metadata = SEO_ENHANCED
  ? {
      title: "Sản phẩm",
      description: "Danh sách giày nam, giày nữ và phụ kiện thể thao — giá niêm yết bằng VND, cập nhật mỗi phút.",
      alternates: { canonical: "/products" },
      openGraph: { ...OG_BASE, url: "/products", title: "Sản phẩm" },
    }
  : { title: "Sản phẩm" };

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Sản phẩm", href: "/products" },
        ]}
      />
      <h1 className="text-2xl font-bold">Sản phẩm</h1>
      <p className="mt-1 text-sm text-muted">{products.length} sản phẩm · ISR revalidate 60 giây</p>

      {(Object.keys(CATEGORIES) as Category[]).map((c, index) => {
        const items = products.filter((p) => p.category === c);
        if (items.length === 0) return null;
        return (
          <section key={c} id={c} aria-labelledby={`h-${c}`} className="mt-8 scroll-mt-20">
            <h2 id={`h-${c}`} className="mb-4 text-lg font-bold">
              {CATEGORIES[c]}
            </h2>
            <ProductGrid products={items} priorityCount={index === 0 ? 4 : 0} />
          </section>
        );
      })}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/products/${p.id}`),
            name: p.name,
          })),
        }}
      />
    </>
  );
}
