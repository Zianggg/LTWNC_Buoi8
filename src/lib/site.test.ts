import assert from "node:assert/strict";
import { test } from "node:test";
import { safeCallbackUrl } from "./site.ts";

test("giữ đường dẫn nội bộ", () => {
  assert.equal(safeCallbackUrl("/admin"), "/admin");
  assert.equal(safeCallbackUrl("/products/88?x=1#top"), "/products/88?x=1#top");
});

test("chặn open redirect", () => {
  for (const bad of ["//evil.example", "/\\evil.example", "/\t/evil.example", "/\n/evil.example", "https://evil.example", "evil", ""]) {
    assert.equal(safeCallbackUrl(bad), "/dashboard", JSON.stringify(bad));
  }
  assert.equal(safeCallbackUrl(undefined), "/dashboard");
  assert.equal(safeCallbackUrl(["/admin"]), "/dashboard");
});
