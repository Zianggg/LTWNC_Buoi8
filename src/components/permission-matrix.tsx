import { ACTION_LABELS, can, ROLES, type Action, type Role } from "@/lib/permissions";

export function PermissionMatrix({ highlight }: { highlight?: Role }) {
  const actions = Object.keys(ACTION_LABELS) as Action[];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 text-left font-medium">Hành động \ Vai trò</th>
            {ROLES.map((r) => (
              <th key={r} className={`px-3 py-2 font-medium ${r === highlight ? "text-foreground" : ""}`}>
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => (
            <tr key={a} className="border-b border-border">
              <td className="py-2 pr-4">
                {ACTION_LABELS[a]} <span className="font-mono text-xs text-muted">{a}</span>
              </td>
              {ROLES.map((r) => (
                <td
                  key={r}
                  className={`px-3 py-2 text-center ${r === highlight ? "bg-border/40" : ""}`}
                  aria-label={can(r, a) ? "được phép" : "không được phép"}
                >
                  {can(r, a) ? "✓" : "✕"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
