// Chạy: npm test  (node --test, Node 22 tự bỏ kiểu TypeScript)
import assert from "node:assert/strict";
import { test } from "node:test";
import { can, permissions } from "./permissions.ts";

test("guest chỉ được xem sản phẩm", () => {
  assert.equal(can(undefined, "product:read"), true);
  assert.equal(can("guest", "cart:add"), false);
  assert.equal(can("guest", "dashboard:view"), false);
});

test("user mua hàng được nhưng không vào được admin", () => {
  assert.equal(can("user", "cart:add"), true);
  assert.equal(can("user", "order:create"), true);
  assert.equal(can("user", "product:write"), false);
  assert.equal(can("user", "admin:access"), false);
});

test("admin kế thừa toàn bộ quyền của user", () => {
  for (const action of permissions.user) assert.equal(can("admin", action), true);
  assert.equal(can("admin", "product:write"), true);
  assert.equal(can("admin", "user:manage"), true);
});
