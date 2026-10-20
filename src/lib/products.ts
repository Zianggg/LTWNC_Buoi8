import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Session } from "next-auth";
import { z } from "zod";
import { can } from "@/lib/permissions";

export const CATEGORIES = {
  "giay-nam": "Giày nam",
  "giay-nu": "Giày nữ",
  "phu-kien": "Phụ kiện thể thao",
} as const;
export type Category = keyof typeof CATEGORIES;

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.enum(["giay-nam", "giay-nu", "phu-kien"]),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  rating: z.number(),
  description: z.string(),
  image: z.string(),
  updatedAt: z.string(),
  deleted: z.boolean(),
});
export type Product = z.infer<typeof ProductSchema>;

// "CSDL" là file JSON để demo được Server Action + revalidatePath khi chạy `next start` trên máy.
const DB_FILE = path.join(process.cwd(), "data", "products.json");

async function readAll(): Promise<Product[]> {
  const raw: unknown = JSON.parse(await readFile(DB_FILE, "utf8"));
  return z.array(ProductSchema).parse(raw);
}

export async function getProducts(category?: Category): Promise<Product[]> {
  const all = await readAll();
  return all.filter((p) => !p.deleted && (!category || p.category === category));
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const all = await readAll();
  return all.find((p) => p.id === id && !p.deleted);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getProducts();
  return all.filter((p) => `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q));
}

/** Dùng cho trang admin: gồm cả sản phẩm đã xoá mềm. */
export async function getAllProductsForAdmin(session: Session): Promise<Product[]> {
  if (!can(session.user.role, "product:write")) throw new Error("FORBIDDEN");
  return readAll();
}

// Lớp 4 — tầng dữ liệu tự kiểm tra lại quyền, không tin nơi gọi.
export async function setProductDeleted(session: Session, id: string, deleted: boolean): Promise<Product> {
  if (!can(session.user.role, "product:write")) throw new Error("FORBIDDEN");
  const all = await readAll();
  const target = all.find((p) => p.id === id);
  if (!target) throw new Error("NOT_FOUND");
  target.deleted = deleted;
  target.updatedAt = new Date().toISOString();
  await writeFile(DB_FILE, JSON.stringify(all, null, 2) + "\n", "utf8");
  return target;
}
