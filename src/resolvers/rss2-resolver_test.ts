import { assert, assertEquals } from "../../test_deps.ts";
import { resolveRss2Field } from "./rss2-resolver.ts";

Deno.test("RSS 2.0 resolver", () => {
  [undefined, null].forEach((field: any) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assert(propertyName === field, `propertyName should be null for field: ${field}`);
    assertEquals(false, isArray, `isArray should be false for field: ${field}`);
    assertEquals(false, isNumber, `isNumber should be false for field: ${field}`);
    assertEquals(false, isDate, `isDate should be false for field: ${field}`);
  });

  ["ttl", "length", "width", "height"].forEach((field) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assertEquals(false, isArray, `isArray should be false for field: ${field}`);
    assertEquals(true, isNumber, "isNumber should be true");
    assertEquals(false, isDate, `isDate should be false for field: ${field}`);
  });

  ["item", "category"].forEach((field) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assertEquals(true, isArray, `isArray should be true for field: ${field}`);
    assertEquals(false, isNumber, `isNumber should be false for field: ${field}`);
    assertEquals(false, isDate, `isDate should be false for field: ${field}`);
  });

  ["pubdate", "lastbuilddate"].forEach((field) => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assertEquals(false, isArray, `isArray should be false for field: ${field}`);
    assertEquals(false, isNumber, `isNumber should be false for field: ${field}`);
    assertEquals(true, isDate, `isDate should be true for field: ${field}`);
  });
});
