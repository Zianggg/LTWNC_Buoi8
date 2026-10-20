import type { Metadata } from "next";
import Link from "next/link";
import { ProductStatusForm } from "@/components/product-status-form";
import { RoleBadge } from "@/components/role-badge";
import { requirePermission } from "@/lib/guards";
import { CATEGORIES, getAllProductsForAdmin } from "@/lib/products";
import { formatVnd } from "@/lib/site";
import { listUsers } from "@/lib/users";

export const metadata: Metadata = { title: "Quản trị" };

export default async function AdminPage() {
  // Lớp 2 — kiểm tra lại dù proxy đã chặn: dữ liệu chỉ được lấy khi đủ quyền.
  const session = await requirePermission("admin:access", "/admin");
  const products = await getAllProductsForAdmin(session);
  const users = listUsers();

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="products">
        <div className="mb-3 flex items-end justify-between">
          <h1 id="products" className="text-2xl font-bold">
            Quản trị sản phẩm
          </h1>
          <p className="text-sm text-muted">
            {products.filter((p) => !p.deleted).length}/{products.length} đang bán
          </p>
        </div>
        <p className="mb-4 text-sm text-muted">
          Gỡ/khôi phục gọi Server Action → kiểm tra quyền + zod → ghi data/products.json → revalidatePath các trang ISR.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Sản phẩm</th>
                <th className="px-4 py-2 font-medium">Danh mục</th>
                <th className="px-4 py-2 text-right font-medium">Giá</th>
                <th className="px-4 py-2 font-medium">Trạng thái</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={`border-b border-border last:border-0 ${p.deleted ? "opacity-60" : ""}`}>
                  <td className="px-4 py-2 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-2">
                    {p.deleted ? (
                      p.name
                    ) : (
                      <Link href={`/products/${p.id}`} className="hover:underline">
                        {p.name}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-2 text-muted">{CATEGORIES[p.category]}</td>
                  <td className="px-4 py-2 text-right">{formatVnd(p.price)}</td>
                  <td className="px-4 py-2">{p.deleted ? "Đã gỡ" : "Đang bán"}</td>
                  <td className="px-4 py-2">
                    {p.deleted ? (
                      <ProductStatusForm id={p.id} intent="restore" label="Khôi phục" />
                    ) : (
                      <ProductStatusForm id={p.id} intent="delete" label="Gỡ" variant="danger" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="users">
        <h2 id="users" className="mb-3 text-lg font-bold">
          Người dùng (user:manage)
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 text-sm">
              <span>
                <span className="font-medium">{u.name}</span>
                <span className="block text-muted">{u.email}</span>
              </span>
              <RoleBadge role={u.role} />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Tài khoản GitHub nhận vai trò theo biến ADMIN_GITHUB_LOGINS.</p>
      </section>
    </div>
  );
}
