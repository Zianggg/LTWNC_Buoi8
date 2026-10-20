// Ma trận phân quyền RBAC — nguồn duy nhất cho proxy, page và Server Action.
export const ROLES = ["guest", "user", "admin"] as const;
export type Role = (typeof ROLES)[number];
/** Vai trò của người đã đăng nhập (guest = chưa đăng nhập, không lưu trong phiên). */
export type SessionRole = Exclude<Role, "guest">;

export type Action =
  | "product:read"
  | "cart:add"
  | "order:create"
  | "order:read-own"
  | "dashboard:view"
  | "product:write"
  | "user:manage"
  | "admin:access";

const userActions: readonly Action[] = [
  "product:read",
  "cart:add",
  "order:create",
  "order:read-own",
  "dashboard:view",
];

export const permissions: Record<Role, readonly Action[]> = {
  guest: ["product:read"],
  user: userActions,
  admin: [...userActions, "product:write", "user:manage", "admin:access"],
};

export function can(role: Role | undefined, action: Action): boolean {
  return permissions[role ?? "guest"].includes(action);
}

export const ACTION_LABELS: Record<Action, string> = {
  "product:read": "Xem sản phẩm",
  "cart:add": "Thêm vào giỏ hàng",
  "order:create": "Đặt hàng",
  "order:read-own": "Xem đơn hàng của mình",
  "dashboard:view": "Vào /dashboard",
  "product:write": "Sửa / xoá sản phẩm",
  "user:manage": "Quản lý người dùng",
  "admin:access": "Vào /admin",
};
