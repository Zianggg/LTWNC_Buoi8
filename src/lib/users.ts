import "server-only";
import bcrypt from "bcryptjs";
import type { SessionRole } from "@/lib/permissions";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: SessionRole;
  /** bcrypt, cost 10 — không bao giờ lưu mật khẩu gốc */
  passwordHash: string;
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

// Tài khoản mẫu (mật khẩu ghi trong README): admin@shop.vn / Admin@123, user@shop.vn / User@123
const users: readonly StoredUser[] = [
  {
    id: "u-admin",
    name: "An Quản Trị",
    email: "admin@shop.vn",
    role: "admin",
    passwordHash: "$2b$10$FRh5RlS4/T74mn9Jc1AJS.qNyyikJCy2aZXEc1jTigP2q.AFO8Tm.",
  },
  {
    id: "u-binh",
    name: "Bình Khách Hàng",
    email: "user@shop.vn",
    role: "user",
    passwordHash: "$2b$10$wKHWRZphDzRouwI7Fzkj1uOtJTI2UI9A9lvGbOFDugnXPlNrxAwX.",
  },
];

// Hash giả để so sánh khi email không tồn tại → thời gian phản hồi như nhau, khó dò email.
const DUMMY_HASH = "$2b$10$wKHWRZphDzRouwI7Fzkj1uOtJTI2UI9A9lvGbOFDugnXPlNrxAwX.";

export async function verifyUser(email: string, password: string): Promise<PublicUser | null> {
  const found = users.find((u) => u.email === email.toLowerCase());
  const ok = await bcrypt.compare(password, found?.passwordHash ?? DUMMY_HASH);
  if (!found || !ok) return null;
  return toPublic(found);
}

function toPublic({ id, name, email, role }: StoredUser): PublicUser {
  return { id, name, email, role };
}

export function listUsers(): PublicUser[] {
  return users.map(toPublic);
}
