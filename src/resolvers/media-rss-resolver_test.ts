import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { resolveMediaRssField } from "./media-rss-resolver.ts";
import { MediaRssFields } from "./../types/fields/mod.ts";

[
  {
    propertyName: "",
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: undefined,
      propertyName: '',
      handled: false,
    },
  },
  {
    propertyName: MediaRssFields.Comment,
    expect: {
      isArray: true,
      isInt: undefined,
			isFloat: undefined,
      isDate: undefined,
      propertyName: MediaRssFields.Comment,
      handled: true,
    },
  },
  {
    propertyName: MediaRssFields.Response,
    expect: {
      isArray: true,
      isInt: undefined,
			isFloat: undefined,
      isDate: undefined,
      propertyName: MediaRssFields.Response,
      handled: true,
    },
  },
  {
    propertyName: MediaRssFields.Scene,
    expect: {
      isArray: true,
      isInt: undefined,
			isFloat: undefined,
      isDate: undefined,
      propertyName: MediaRssFields.Scene,
      handled: true,
    },
  },
].forEach((test) => {
  Deno.test(`MediaRssResolver:${test.propertyName}`, () => {
    const result = resolveMediaRssField(test.propertyName);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.handled, test.expect.handled, "handled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isInt, test.expect.isInt, "isInt");
		assertEquals(result.isFloat, test.expect.isFloat, "isFloat");
    assertEquals(result.propertyName, test.expect.propertyName, "propertyName");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
