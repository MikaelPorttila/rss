import { assert, assertEquals } from "../../test_deps.ts";
import { resolveRss1Field } from "./rss1-resolver.ts";

Deno.test("RSS 1.0 resolver", () => {
  [undefined, null].forEach((field: any) => {
    const result = resolveRss1Field(field);

    assert(() => result.name === field, "name should be null");
    assertEquals(
      false,
      result.isArray,
      `isArray should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isInt,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isDate,
      `isDate should be false for field: ${field}`,
    );
  });

  ["item"].forEach((field) => {
    const result = resolveRss1Field(field);

    assertEquals(
      true,
      result.isArray,
      `isArray should be true for field: ${field}`,
    );
    assertEquals(
      false,
      result.isInt,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isDate,
      `isDate should be false for field: ${field}`,
    );
  });

  ["channel", "title", "link", "description", "image"].forEach((field) => {
    const result = resolveRss1Field(field);
    assertEquals(
      field,
      result.name,
      "field and name should be the same",
    );
    assertEquals(
      false,
      result.isArray,
      `isArray should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isInt,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isDate,
      `isDate should be false for field: ${field}`,
    );
  });
});
