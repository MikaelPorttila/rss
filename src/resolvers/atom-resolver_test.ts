import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { resolveAtomField } from "./atom-resolver.ts";

[undefined, null].forEach((field: any) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

    assert(() => propertyName === field, "propertyName should be null");
    assertEquals(false, isArray, "isArray should be false");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["category", "link", "entry"].forEach((field) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

    assertEquals(true, isArray, "isArray should be true");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["updated", "published"].forEach((field) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

    assertEquals(false, isArray, "isArray should be false");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(true, isDate, "isDate should be true");
  });
});
