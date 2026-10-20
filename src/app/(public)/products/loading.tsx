export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">Đang tải sản phẩm…</p>
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-border/70" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-border/60" />
        ))}
      </div>
    </div>
  );
}
