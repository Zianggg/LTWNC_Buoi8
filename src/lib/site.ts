export const SITE = {
  name: "B8 Sport Shop",
  shortName: "B8 Shop",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  description:
    "Cửa hàng giày và phụ kiện thể thao — bài thực hành Next.js nâng cao: NextAuth, Proxy, RBAC và SEO.",
  locale: "vi_VN",
} as const;

/** SEO_MODE=before → bản "trước" (không canonical/description/JSON-LD, ảnh <img>, font hệ thống). */
export const SEO_ENHANCED = process.env.SEO_MODE !== "before";

// Trang con khai báo openGraph sẽ THAY cả object của layout (không gộp sâu) → luôn trải OG_BASE vào.
export const OG_BASE = { siteName: SITE.name, locale: SITE.locale, type: "website" } as const;

export function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE.url).toString();
}

/** Chỉ cho phép đường dẫn nội bộ để tránh open redirect qua ?callbackUrl= */
// Phân tích bằng URL rồi so origin: chặn cả "//evil", "/\evil" và "/\t/evil" (trình duyệt bỏ tab/xuống dòng).
export function safeCallbackUrl(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/") || /[\u0000-\u001f\\]/.test(value)) return fallback;
  try {
    const base = new URL(SITE.url);
    const u = new URL(value, base);
    if (u.origin !== base.origin) return fallback;
    return u.pathname + u.search + u.hash;
  } catch {
    return fallback;
  }
}
