import type { NextAuthConfig } from "next-auth";

// Cấu hình "nhẹ": không bcrypt, không đọc file — dùng chung cho proxy.ts và auth.ts.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    jwt({ token, user, account }) {
      // user chỉ có mặt ngay lúc đăng nhập
      if (user) {
        // Với OAuth (không có adapter), Auth.js gán user.id = UUID ngẫu nhiên mỗi lần đăng nhập
        // → dùng providerAccountId để id ổn định (gắn được đơn hàng theo userId).
        token.id =
          account && account.type === "oauth" ? `${account.provider}:${account.providerAccountId}` : (user.id ?? token.sub ?? "");
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
