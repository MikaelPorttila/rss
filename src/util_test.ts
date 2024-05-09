import { assertEquals } from "../test_deps.ts";
import { copyValueFields } from "./util.ts";

Deno.test("CopyValueFields", () => {
  // Setup
  const target = {
    a: undefined,
    b: undefined,
    c: "cValue",
  };
  const source = {
    a: { value: "aValue" },
    b: "bValue",
  };

  // Act
  copyValueFields(["a", "b", "c"], source, target);

  // Assert
  assertEquals(target.a, "aValue");
  assertEquals(target.b, "bValue");
  assertEquals(target.c, "cValue");
});
