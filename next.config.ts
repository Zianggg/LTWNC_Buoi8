import type { NextConfig } from "next";

// SEO_MODE=before: bản "trước" để so sánh Lighthouse (build ra thư mục riêng, chạy cổng 3001).
const isBefore = process.env.SEO_MODE === "before";

const nextConfig: NextConfig = {
  // Tắt Cache Components để dùng mô hình cache trong bài (revalidate, generateStaticParams, revalidatePath).
  cacheComponents: false,
  distDir: isBefore ? ".next-before" : ".next",
  env: { SEO_MODE: isBefore ? "before" : "after" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
