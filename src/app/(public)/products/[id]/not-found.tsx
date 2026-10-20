import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-xl font-bold">Không tìm thấy sản phẩm</h1>
      <p className="mt-2 text-muted">Sản phẩm không tồn tại hoặc đã bị quản trị viên gỡ.</p>
      <Link href="/products" className="mt-4 inline-block text-sm underline">
        ← Về danh sách sản phẩm
      </Link>
    </div>
  );
}
