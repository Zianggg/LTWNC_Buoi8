import { OG_SIZE, renderOgCard } from "@/lib/og";
import { getProducts } from "@/lib/products";

// /products khai báo openGraph riêng nên không thừa hưởng ảnh của (public) → cần ảnh riêng.
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Danh sách sản phẩm B8 Sport Shop";
export const revalidate = 60;

export default async function Image() {
  const products = await getProducts();
  return renderOgCard({
    eyebrow: "Sản phẩm",
    title: `${products.length} mẫu giày & phụ kiện thể thao`,
    subtitle: "Giày nam · Giày nữ · Phụ kiện thể thao",
  });
}
