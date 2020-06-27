import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { resolveRss2Field } from "./rss2-resolver.ts";

[undefined, null].forEach((field: any) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assert(propertyName === field, "propertyName should be null");
    assertEquals(false, isArray, "isArray should be false");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["ttl", "length", "width", "height"].forEach((field) => {
  Deno.test(`When nodeName is '${field}'`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assertEquals(false, isArray, "isArray should be false");
    assertEquals(true, isNumber, "isNumber should be true");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["item", "category"].forEach((field) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assertEquals(true, isArray, "isArray should be true");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(false, isDate, "isDate should be false");
  });
});

["pubdate", "lastbuilddate"].forEach((field) => {
  Deno.test(`When nodeName is ${field}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(field);

    assertEquals(false, isArray, "isArray should be false");
    assertEquals(false, isNumber, "isNumber should be false");
    assertEquals(true, isDate, "isDate should be true");
  });
});
