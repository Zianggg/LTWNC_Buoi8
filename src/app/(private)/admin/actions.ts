"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { setProductDeleted } from "@/lib/products";

export type ActionResult = { ok: boolean; message: string } | null;

const ProductStatusSchema = z.object({
  id: z.string().regex(/^\d{1,6}$/, "id sản phẩm không hợp lệ"),
  intent: z.enum(["delete", "restore"]),
});

/**
 * Lớp 3 — Server Action là endpoint công khai (ai cũng POST được),
 * nên tự kiểm tra phiên, vai trò và validate dữ liệu bằng zod.
 */
export async function updateProductStatus(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "401 — Chưa đăng nhập." };
  if (!can(session.user.role, "product:write")) {
    return { ok: false, message: `403 — Vai trò "${session.user.role}" không có quyền product:write.` };
  }

  const parsed = ProductStatusSchema.safeParse({ id: formData.get("id"), intent: formData.get("intent") });
  if (!parsed.success) {
    return { ok: false, message: `400 — ${parsed.error.issues.map((i) => i.message).join("; ")}` };
  }

  const { id, intent } = parsed.data;
  try {
    const product = await setProductDeleted(session, id, intent === "delete");
    // ISR theo yêu cầu: làm mới ngay các trang tĩnh liên quan
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin");
    return { ok: true, message: `${intent === "delete" ? "Đã gỡ" : "Đã khôi phục"} “${product.name}”.` };
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") return { ok: false, message: "404 — Không có sản phẩm này." };
    throw e;
  }
}
