import { assert, assertEquals } from "../../test_deps.ts";
import { resolveRss1Field } from "./rss1-resolver.ts";

Deno.test("RSS 1.0 resolver", () => {
  [undefined, null].forEach((field: any) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss1Field(field);

    assert(() => propertyName === field, "propertyName should be null");
    assertEquals(false, isArray, `isArray should be false for field: ${field}`);
    assertEquals(
      false,
      isNumber,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(false, isDate, `isDate should be false for field: ${field}`);
  });

  ["item"].forEach((field) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss1Field(field);

    assertEquals(true, isArray, `isArray should be true for field: ${field}`);
    assertEquals(
      false,
      isNumber,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(false, isDate, `isDate should be false for field: ${field}`);
  });

  ["channel", "title", "link", "description", "image"].forEach((field) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss1Field(field);
    assertEquals(
      field,
      propertyName,
      "field and propertyName should be the same",
    );
    assertEquals(false, isArray, `isArray should be false for field: ${field}`);
    assertEquals(
      false,
      isNumber,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(false, isDate, `isDate should be false for field: ${field}`);
  });
});
