import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { CATEGORIES, type Product } from "@/lib/products";
import { formatVnd } from "@/lib/site";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-border/40">
        <ProductImage
          src={product.image}
          alt={product.name}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-muted">
          {CATEGORIES[product.category]} · {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium group-hover:underline">{product.name}</h3>
        <p className="mt-auto pt-1 text-sm font-bold">{formatVnd(product.price)}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
