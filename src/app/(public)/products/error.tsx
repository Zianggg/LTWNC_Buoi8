"use client";

// Next 16: retry() fetch lại dữ liệu server rồi render lại; reset() chỉ render lại.
export default function ProductsError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-border bg-card p-6">
      <h2 className="font-bold">Không tải được sản phẩm</h2>
      <p className="mt-1 text-sm text-muted">{error.digest ? `Mã lỗi: ${error.digest}` : error.message}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded-md bg-foreground px-3 py-1.5 text-sm text-background"
      >
        Thử lại
      </button>
    </div>
  );
}
