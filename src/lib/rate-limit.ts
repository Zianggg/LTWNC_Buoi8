import "server-only";

// Chống dò mật khẩu (chỉ để demo — bộ nhớ tiến trình; bản thật dùng Redis/DB chia sẻ giữa các server):
// - theo cặp email + IP: 5 lần sai / 10 phút → khoá cặp đó (người khác IP không khoá được tài khoản của bạn)
// - theo IP: 20 lần sai / 10 phút → khoá IP (chống thử 1 mật khẩu trên nhiều email)
const WINDOW_MS = 10 * 60 * 1000;
const MAX_KEYS = 10_000;
export const LIMITS = { account: 5, ip: 20 } as const;

type Entry = { fails: number; firstFailAt: number };
const attempts = new Map<string, Entry>();

function current(key: string, now: number): Entry | undefined {
  const e = attempts.get(key);
  if (e && now - e.firstFailAt > WINDOW_MS) {
    attempts.delete(key);
    return undefined;
  }
  return e;
}

export function isLocked(key: string, limit: number, now = Date.now()): boolean {
  return (current(key, now)?.fails ?? 0) >= limit;
}

export function recordFailure(key: string, now = Date.now()): void {
  const e = current(key, now);
  if (e) {
    e.fails += 1;
    return;
  }
  // Giới hạn kích thước Map: bỏ khoá cũ nhất (Map giữ thứ tự chèn)
  if (attempts.size >= MAX_KEYS) attempts.delete(attempts.keys().next().value as string);
  attempts.set(key, { fails: 1, firstFailAt: now });
}

export function resetFailures(key: string): void {
  attempts.delete(key);
}
