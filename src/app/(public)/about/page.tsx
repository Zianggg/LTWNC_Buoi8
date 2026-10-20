import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { OG_BASE, SEO_ENHANCED } from "@/lib/site";

export const metadata: Metadata = SEO_ENHANCED
  ? {
      title: "Giới thiệu",
      description: "Giới thiệu B8 Sport Shop và cách dự án áp dụng SSG, ISR, SSR cùng NextAuth và phân quyền RBAC.",
      alternates: { canonical: "/about" },
      openGraph: { ...OG_BASE, url: "/about", title: "Giới thiệu" },
    }
  : { title: "Giới thiệu" };

const rows = [
  ["/", "SSG", "Nội dung ít đổi; revalidatePath('/') khi admin sửa dữ liệu"],
  ["/about", "SSG", "Nội dung tĩnh hoàn toàn"],
  ["/products", "ISR 60s", "Danh mục đổi định kỳ, cần SEO"],
  ["/products/[id]", "SSG + ISR 60s", "generateStaticParams sinh sẵn; revalidatePath khi admin xoá"],
  ["/search?q=", "SSR", "Phụ thuộc tham số tìm kiếm của từng request"],
  ["/login", "SSR", "Đọc phiên và callbackUrl"],
  ["/dashboard", "SSR", "Phụ thuộc người dùng (auth())"],
  ["/admin", "SSR", "Phụ thuộc người dùng + vai trò admin"],
] as const;

export default function AboutPage() {
  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Giới thiệu", href: "/about" },
        ]}
      />
      <h1 className="text-2xl font-bold">Giới thiệu</h1>
      <p className="mt-3 text-muted">
        B8 Sport Shop là khung dự án Next.js 16 (App Router, TypeScript) cho bài tập Buổi 8: đăng nhập bằng NextAuth
        (GitHub OAuth + email/mật khẩu), phân quyền 2 vai trò admin/user ở nhiều lớp và SEO cho trang công khai.
      </p>
      <h2 className="mt-8 text-lg font-bold">Chiến lược render từng trang</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="py-2 pr-4 font-medium">Route</th>
              <th className="py-2 pr-4 font-medium">Chiến lược</th>
              <th className="py-2 font-medium">Lý do</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([route, strategy, reason]) => (
              <tr key={route} className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">{route}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{strategy}</td>
                <td className="py-2">{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
