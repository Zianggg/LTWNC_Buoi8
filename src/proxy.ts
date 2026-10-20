// Lớp 1 — Proxy (Next.js 16 đổi tên middleware.ts → proxy.ts): chặn sớm, chỉ đọc JWT trong cookie.
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { can } from "@/lib/permissions";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;

  if (!user) {
    const login = new URL("/login", nextUrl);
    login.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(login);
  }

  if (nextUrl.pathname.startsWith("/admin") && !can(user.role, "admin:access")) {
    return NextResponse.redirect(new URL("/403", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
