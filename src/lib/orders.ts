import "server-only";
import type { Session } from "next-auth";
import { can } from "@/lib/permissions";

export type Order = {
  id: string;
  userId: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  status: "Đang giao" | "Đã giao" | "Chờ xác nhận";
  createdAt: string;
};

const orders: readonly Order[] = [
  {
    id: "DH-1001",
    userId: "u-binh",
    items: [{ productId: "90", name: "Puma Future Rider Trainers", qty: 1, price: 2250000 }],
    status: "Đã giao",
    createdAt: "2026-10-02T09:15:00.000Z",
  },
  {
    id: "DH-1007",
    userId: "u-binh",
    items: [
      { productId: "140", name: "Basketball", qty: 2, price: 375000 },
      { productId: "88", name: "Nike Air Jordan 1 Red And Black", qty: 1, price: 3750000 },
    ],
    status: "Đang giao",
    createdAt: "2026-10-18T14:40:00.000Z",
  },
  {
    id: "DH-1003",
    userId: "u-admin",
    items: [{ productId: "139", name: "Baseball Glove", qty: 1, price: 625000 }],
    status: "Chờ xác nhận",
    createdAt: "2026-10-10T08:00:00.000Z",
  },
];

// Lớp 4 — userId lấy từ phiên phía server, hàm không nhận userId từ client.
export function getMyOrders(session: Session): Order[] {
  if (!can(session.user.role, "order:read-own")) return [];
  return orders.filter((o) => o.userId === session.user.id);
}
