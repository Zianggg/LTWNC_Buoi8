import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { PUBLIC_NAV, SiteFooter, SiteHeader } from "@/components/site-header";
import { UserMenu } from "@/components/user-menu";

// Route group (public): không xuất hiện trong URL, chỉ để dùng layout riêng cho trang công khai.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SiteHeader nav={PUBLIC_NAV} right={<UserMenu />} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <SiteFooter />
    </SessionProvider>
  );
}
