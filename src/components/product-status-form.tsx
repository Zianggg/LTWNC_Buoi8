"use client";

import { useActionState } from "react";
import { updateProductStatus, type ActionResult } from "@/app/(private)/admin/actions";

type Props = { id: string; intent: "delete" | "restore"; label: string; variant?: "danger" | "default" };

export function ProductStatusForm({ id, intent, label, variant = "default" }: Props) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(updateProductStatus, null);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="intent" value={intent} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-md px-3 py-1 text-xs font-medium disabled:opacity-60 ${
          variant === "danger" ? "bg-red-600 text-white" : "border border-border hover:border-foreground"
        }`}
      >
        {pending ? "Đang xử lý…" : label}
      </button>
      {state && (
        <p role="status" className={`text-xs ${state.ok ? "text-green-700 dark:text-green-400" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
