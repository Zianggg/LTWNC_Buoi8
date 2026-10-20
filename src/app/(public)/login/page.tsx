import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, githubEnabled } from "@/auth";
import { safeCallbackUrl } from "@/lib/site";
import { loginWithGithub } from "./actions";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Đăng nhập", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { callbackUrl: rawCallback, error } = await searchParams;
  const callbackUrl = safeCallbackUrl(rawCallback);

  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      <p className="mt-1 text-sm text-muted">
        Cần đăng nhập để vào <span className="font-mono">{callbackUrl}</span>
      </p>

      {typeof error === "string" && (
        <p role="alert" className="mt-4 rounded-md border border-border bg-card px-3 py-2 text-sm">
          Đăng nhập OAuth không thành công ({error}).
        </p>
      )}

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <form action={loginWithGithub}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button
            type="submit"
            disabled={!githubEnabled}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-sm font-medium hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Đăng nhập với GitHub
          </button>
          {!githubEnabled && (
            <p className="mt-2 text-xs text-muted">
              Chưa cấu hình AUTH_GITHUB_ID / AUTH_GITHUB_SECRET trong .env.local (xem README).
            </p>
          )}
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" /> hoặc email <span className="h-px flex-1 bg-border" />
        </div>

        <LoginForm callbackUrl={callbackUrl} />
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted">
        <p className="font-medium text-foreground">Tài khoản mẫu</p>
        <p className="mt-1 font-mono text-xs">admin@shop.vn / Admin@123 (admin)</p>
        <p className="font-mono text-xs">user@shop.vn / User@123 (user)</p>
      </div>
    </div>
  );
}
