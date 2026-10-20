import { OG_SIZE, renderOgCard } from "@/lib/og";
import { CATEGORIES, getProduct } from "@/lib/products";
import { formatVnd } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Ảnh chia sẻ sản phẩm";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) {
    return renderOgCard({ eyebrow: "B8 Sport Shop", title: "Không tìm thấy sản phẩm", subtitle: "" });
  }
  return renderOgCard({
    eyebrow: `${CATEGORIES[p.category]} · ${p.brand}`,
    title: p.name,
    subtitle: p.stock > 0 ? `Còn hàng · Đánh giá ${p.rating.toFixed(1)}/5` : "Tạm hết hàng",
    // Font Be Vietnam Pro không có glyph "₫" → dùng chữ "đ"
    badge: formatVnd(p.price).replace("₫", "đ"),
  });
}
