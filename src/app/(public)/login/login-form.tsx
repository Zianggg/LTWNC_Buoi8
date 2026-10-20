"use client";

import { useActionState } from "react";
import { loginWithCredentials, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginWithCredentials, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="user@shop.vn"
          className="h-10 rounded-md border border-border bg-background px-3"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Mật khẩu
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          className="h-10 rounded-md border border-border bg-background px-3"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-foreground text-sm font-medium text-background disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
