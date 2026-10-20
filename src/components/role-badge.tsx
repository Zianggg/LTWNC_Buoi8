import type { SessionRole } from "@/lib/permissions";

export function RoleBadge({ role }: { role: SessionRole }) {
  const style =
    role === "admin"
      ? "bg-accent text-accent-foreground"
      : "border border-border text-muted";
  return <span className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase ${style}`}>{role}</span>;
}
