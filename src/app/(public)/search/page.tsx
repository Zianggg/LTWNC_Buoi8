import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-card";
import { searchProducts } from "@/lib/products";

// SSR: đọc searchParams → Next.js render lại ở MỖI request. Kết quả tìm kiếm không nên lập chỉ mục.
export const metadata: Metadata = {
  title: "Tìm kiếm",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 100) : "";
  const results = await searchProducts(query);

  return (
    <>
      <h1 className="text-2xl font-bold">Tìm kiếm</h1>
      <form action="/search" className="mt-4 flex max-w-md gap-2">
        <label htmlFor="search-q" className="sr-only">
          Từ khoá
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Nhập tên sản phẩm…"
          className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm"
        />
        <button type="submit" className="h-10 rounded-md bg-foreground px-4 text-sm text-background">
          Tìm
        </button>
      </form>
      <p className="mt-4 mb-6 text-sm text-muted">
        {query ? `${results.length} kết quả cho “${query}” · render lúc ${new Date().toLocaleTimeString("vi-VN")}` : "Nhập từ khoá để tìm."}
      </p>
      {results.length > 0 && <ProductGrid products={results} />}
    </>
  );
}
