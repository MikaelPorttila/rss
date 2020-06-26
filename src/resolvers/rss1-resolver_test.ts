import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { resolveRss1Field } from "./rss1-resolver.ts";

[undefined, null].forEach((field: any) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss1Field(field);

    assert(() => propertyName === field, "propertyName should be null");
    assertEquals(false, isArray, "isArray should be false");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["item"].forEach((field) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss1Field(field);

    assertEquals(true, isArray, "isArray should be true");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["channel", "title", "link", "description", "image"].forEach((field) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss1Field(field);
    assertEquals(
      field,
      propertyName,
      "field and propertyName should be the same",
    );
    assertEquals(false, isArray, "isArray should be false");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});
