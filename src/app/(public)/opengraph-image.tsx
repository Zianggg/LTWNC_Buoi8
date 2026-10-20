import { OG_SIZE, renderOgCard } from "@/lib/og";

// Ảnh chia sẻ mặc định cho các trang công khai (trang chi tiết có ảnh riêng).
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "B8 Sport Shop — giày và phụ kiện thể thao";

export default function Image() {
  return renderOgCard({
    eyebrow: "LTWNC · Buổi 8",
    title: "Giày & phụ kiện thể thao chính hãng",
    subtitle: "Next.js 16 · NextAuth · Proxy · RBAC · SEO",
  });
}
