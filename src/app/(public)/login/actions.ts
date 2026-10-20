"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn, signOut } from "@/auth";
import { safeCallbackUrl } from "@/lib/site";

export type LoginState = { error: string | null };

export async function loginWithCredentials(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const redirectTo = safeCallbackUrl(formData.get("callbackUrl"));
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo,
    });
    return { error: null };
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        error:
          error.code === "rate_limited"
            ? "Sai mật khẩu quá nhiều lần. Tài khoản bị tạm khoá 10 phút."
            : "Email hoặc mật khẩu không đúng.",
      };
    }
    if (error instanceof AuthError) return { error: "Đăng nhập thất bại, vui lòng thử lại." };
    throw error; // NEXT_REDIRECT khi đăng nhập thành công
  }
}

export async function loginWithGithub(formData: FormData): Promise<void> {
  await signIn("github", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
