import type { Metadata } from "next";
import { PermissionMatrix } from "@/components/permission-matrix";
import { ProductStatusForm } from "@/components/product-status-form";
import { RoleBadge } from "@/components/role-badge";
import { requirePermission } from "@/lib/guards";
import { getMyOrders } from "@/lib/orders";
import { can } from "@/lib/permissions";
import { formatVnd } from "@/lib/site";

export const metadata: Metadata = { title: "Dashboard" };

// SSR: phụ thuộc người dùng đang đăng nhập.
export default async function DashboardPage() {
  const session = await requirePermission("dashboard:view", "/dashboard");
  const orders = getMyOrders(session);
  const { user } = session;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted">Người dùng</p>
            <p className="mt-1 font-medium">{user.name}</p>
            <p className="text-sm text-muted">{user.email ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted">Vai trò (session.user.role)</p>
            <p className="mt-2">
              <RoleBadge role={user.role} />
            </p>
            <p className="mt-1 font-mono text-xs text-muted">id: {user.id}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted">Phiên hết hạn</p>
            <p className="mt-1 font-medium">{new Date(session.expires).toLocaleString("vi-VN")}</p>
            <p className="text-sm text-muted">JWT trong cookie httpOnly</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="orders">
        <h2 id="orders" className="mb-3 text-lg font-bold">
          Đơn hàng của tôi
        </h2>
        <p className="mb-3 text-sm text-muted">Tầng dữ liệu lọc theo userId lấy từ phiên phía server, không nhận id từ client.</p>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">Chưa có đơn hàng.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-border bg-card p-4 text-sm">
                <span className="font-mono">{o.id}</span>
                <span className="flex-1">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</span>
                <span>{formatVnd(o.items.reduce((s, i) => s + i.price * i.qty, 0))}</span>
                <span className="text-muted">{o.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chỉ hiện cho vai trò KHÔNG có quyền ghi — admin bấm sẽ xoá thật */}
      {!can(user.role, "product:write") && (
      <section aria-labelledby="rbac-test" className="rounded-lg border border-dashed border-border p-4">
        <h2 id="rbac-test" className="text-lg font-bold">
          Thử gọi Server Action khi chưa đủ quyền
        </h2>
        <p className="mt-1 mb-3 text-sm text-muted">
          Nút này gọi thẳng action <span className="font-mono">updateProductStatus</span> (xoá sản phẩm #88). Với vai trò
          user, action phải trả về 403 dù nút vẫn hiện.
        </p>
        <div className="flex justify-start">
          <ProductStatusForm id="88" intent="delete" label="Xoá sản phẩm #88" variant="danger" />
        </div>
      </section>
      )}

      <section aria-labelledby="perm">
        <h2 id="perm" className="mb-3 text-lg font-bold">
          Ma trận phân quyền
        </h2>
        <PermissionMatrix highlight={user.role} />
      </section>
    </div>
  );
}
