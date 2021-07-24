import { assert } from "../test_deps.ts";
import { isValidHttpURL } from "./util.ts";

Deno.test("is valid HTTP URL", () => {
  assert(isValidHttpURL("https://test.test"));
  assert(isValidHttpURL("http://test.test"));
  assert(!isValidHttpURL("test.com/test"));
  assert(!isValidHttpURL("test/data/test"));
});
