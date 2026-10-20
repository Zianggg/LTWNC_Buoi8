# LTWNC Buổi 8 — Next.js nâng cao: NextAuth, Proxy, RBAC, SEO

Sinh viên: B23DCCC054 · Báo cáo: [BAO_CAO.md](BAO_CAO.md)

Next.js 16.4.2 (App Router, TypeScript, Tailwind 4) · next-auth 5.0.0-beta.32 · zod 4 · bcryptjs. Node 22.21.1.

## Chạy

```bash
npm install
cp .env.example .env.local      # rồi điền AUTH_SECRET (npx auth secret)
npm run dev                     # http://localhost:3000

npm run build && npm start      # bản production (dùng để kiểm tra và đo)
```

| Lệnh | Việc |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit test `can()` và `safeCallbackUrl()` (`node --test`) |
| `npm run build:before` / `npm run start:before` | Bản "trước" để so sánh Lighthouse (`SEO_MODE=before`, thư mục `.next-before`, cổng 3001) |

## Tài khoản mẫu

| Email | Mật khẩu | Vai trò |
| --- | --- | --- |
| admin@shop.vn | Admin@123 | admin |
| user@shop.vn | User@123 | user |

Mật khẩu chỉ được lưu dạng băm bcrypt trong [src/lib/users.ts](src/lib/users.ts).

### Bật đăng nhập GitHub (OAuth)

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
2. Điền `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` vào `.env.local`.
3. (Tuỳ chọn) `ADMIN_GITHUB_LOGINS=ten-github-cua-ban` để tài khoản GitHub đó có vai trò admin. Các tài khoản khác là user.

Khi chưa điền, nút GitHub bị vô hiệu hoá nhưng đăng nhập email/mật khẩu vẫn chạy.

## Cấu trúc

```
src/
  auth.config.ts        # cấu hình nhẹ (callbacks jwt/session) — dùng chung cho proxy và auth.ts
  auth.ts               # NextAuth: Credentials (zod + bcrypt + chống dò) + GitHub
  proxy.ts              # Lớp 1: Next 16 đổi middleware.ts → proxy.ts
  types/next-auth.d.ts  # mở rộng kiểu Session, User, JWT (role: 'admin' | 'user')
  lib/
    permissions.ts      # ma trận RBAC + can(role, action)
    guards.ts           # Lớp 2: requirePermission() cho page
    products.ts         # Lớp 4: tầng dữ liệu (data/products.json) tự kiểm tra quyền
    orders.ts           # Lớp 4: lọc theo session.user.id
    site.ts, og.tsx     # SEO: SITE, OG_BASE, safeCallbackUrl, ảnh OG
  app/
    (public)/           # trang công khai: / · /about · /products · /products/[id] · /search · /login · /403
    (private)/          # /dashboard · /admin (+ actions.ts = Lớp 3: Server Action)
    api/auth/[...nextauth]/route.ts
    sitemap.ts, robots.ts
reports/
  e2e-auth.txt          # kết quả kiểm tra end-to-end 14/14
  lighthouse/           # report JSON (HTML bị .gitignore) + summary.json
  scripts/              # e2e-auth.mjs, lh-run.mjs, lh-summary.mjs
```

## Chạy lại các script kiểm tra

Các script cần `puppeteer-core` và `lighthouse`. Hai gói này không nằm trong dependency của dự án, nên cài ở thư mục bên cạnh:

```bash
mkdir ../measure-tools && cd ../measure-tools && npm init -y
npm install puppeteer-core@24 lighthouse@13.5.0
cd ../LTWNC_Buoi8
npm run build && npm start                        # cửa sổ 1 (cổng 3000)
npm run build:before && npm run start:before      # cửa sổ 2 (cổng 3001)
node reports/scripts/e2e-auth.mjs                 # khởi động lại server trước mỗi lần chạy (để xoá bộ đếm khoá)
node reports/scripts/lh-run.mjs reports/lighthouse 3
node reports/scripts/lh-summary.mjs reports/lighthouse
```

Đường dẫn Chrome mặc định là `C:/Program Files/Google/Chrome/Application/chrome.exe`. Máy khác thì đặt biến `CHROME_PATH`.

## Ghi chú

- `cacheComponents` được **tắt** trong [next.config.ts](next.config.ts) để dùng mô hình cache như bài giảng (`export const revalidate`, `generateStaticParams`, `revalidatePath`).
- "CSDL" là file `data/products.json`. Admin gỡ/khôi phục sản phẩm sẽ ghi vào file này, nên chỉ chạy được khi dùng `next start` trên máy. Môi trường serverless như Vercel không cho ghi file.
- Bộ đếm chống dò mật khẩu nằm trong bộ nhớ tiến trình, nên khởi động lại server là mất. Đây chỉ là bản demo.
