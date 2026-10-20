import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404 — Không tìm thấy trang", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-5xl font-bold">404</p>
      <h1 className="mt-2 text-lg font-medium">Không tìm thấy trang</h1>
      <Link href="/" className="mt-6 rounded-md bg-foreground px-4 py-2 text-sm text-background">
        Về trang chủ
      </Link>
    </main>
  );
}
