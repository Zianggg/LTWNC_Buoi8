import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ProductImage } from "@/components/product-image";
import { CATEGORIES, getProduct, getProducts } from "@/lib/products";
import { absoluteUrl, formatVnd, OG_BASE, SEO_ENHANCED } from "@/lib/site";

// SSG + ISR: sinh sẵn mọi id lúc build, tạo lại nền sau 60 giây; id mới được render khi có request đầu tiên.
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: "Không tìm thấy sản phẩm", robots: { index: false } };
  if (!SEO_ENHANCED) return { title: p.name };

  const description = `${p.name} (${p.brand}) giá ${formatVnd(p.price)}. ${p.description}`.slice(0, 160);
  return {
    title: p.name,
    description,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: { ...OG_BASE, url: `/products/${p.id}`, title: p.name, description },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const url = absoluteUrl(`/products/${p.id}`);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Sản phẩm", href: "/products" },
          { name: p.name, href: `/products/${p.id}` },
        ]}
      />
      <article className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card">
          <ProductImage src={p.image} alt={p.name} priority sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div>
          <p className="text-sm text-muted">
            {CATEGORIES[p.category]} · {p.brand}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{p.name}</h1>
          <p className="mt-3 text-2xl font-bold text-accent">{formatVnd(p.price)}</p>
          <p className="mt-1 text-sm text-muted">
            {p.stock > 0 ? `Còn ${p.stock} sản phẩm` : "Hết hàng"} · Đánh giá {p.rating.toFixed(1)}/5
          </p>
          <p className="mt-4 leading-relaxed">{p.description}</p>
          <AddToCart productName={p.name} disabled={p.stock === 0} />
        </div>
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": url,
          name: p.name,
          sku: p.id,
          image: [absoluteUrl(p.image)],
          description: p.description,
          category: CATEGORIES[p.category],
          brand: { "@type": "Brand", name: p.brand },
          offers: {
            "@type": "Offer",
            url,
            price: p.price,
            priceCurrency: "VND",
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }}
      />
    </>
  );
}
