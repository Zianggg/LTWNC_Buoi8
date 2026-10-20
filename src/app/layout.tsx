import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { OG_BASE, SEO_ENHANCED, SITE } from "@/lib/site";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Không đặt canonical ở root layout: trang con không ghi đè sẽ bị canonical về "/".
export const metadata: Metadata = SEO_ENHANCED
  ? {
      metadataBase: new URL(SITE.url),
      title: { default: SITE.name, template: `%s | ${SITE.shortName}` },
      description: SITE.description,
      applicationName: SITE.name,
      openGraph: OG_BASE,
      twitter: { card: "summary_large_image" },
    }
  : {
      metadataBase: new URL(SITE.url),
      title: { default: SITE.name, template: `%s | ${SITE.shortName}` },
    };

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${SEO_ENHANCED ? beVietnam.variable : ""} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
