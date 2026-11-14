// Smoke test: the running app answers GET / with the expected response.
// BASE_URL: where the app is reachable (default: http://localhost:8080).
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:8080";

test("GET / returns 200, plain text, Hello world", async () => {
  const response = await fetch(`${BASE_URL}/`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await response.text(), "Hello world\n");
});
