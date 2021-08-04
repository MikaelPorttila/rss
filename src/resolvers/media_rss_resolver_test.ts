import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { resolveMediaRssField } from "./media_rss_resolver.ts";
import { MediaRssFields } from "./../types/fields/mod.ts";

[
  {
    name: "",
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "",
      isHandled: false,
    },
  },
  {
    name: MediaRssFields.Comment,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: MediaRssFields.Comment,
      isHandled: true,
    },
  },
  {
    name: MediaRssFields.Response,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: MediaRssFields.Response,
      isHandled: true,
    },
  },
  {
    name: MediaRssFields.Scene,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: MediaRssFields.Scene,
      isHandled: true,
    },
  },
].forEach((test) => {
  Deno.test(`MediaRssResolver:${test.name}`, () => {
    const result = resolveMediaRssField(test.name);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.isHandled, test.expect.isHandled, "isHandled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isInt, test.expect.isInt, "isInt");
    assertEquals(result.isFloat, test.expect.isFloat, "isFloat");
    assertEquals(result.name, test.expect.name, "name");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
