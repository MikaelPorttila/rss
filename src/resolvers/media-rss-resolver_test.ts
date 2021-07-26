import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { resolveMediaRssField } from "./media-rss-resolver.ts";
import { MediaRssFields } from './../types/media-rss.ts';

[
  {
    propertyName: "",
    expect: {
      isArray: undefined,
      isNumber: undefined,
      isDate: undefined,
      newName: undefined,
      handled: false,
    },
  },
  {
    propertyName: MediaRssFields.Comment,
    expect: {
      isArray: true,
      isNumber: undefined,
      isDate: undefined,
      newName: undefined,
      handled: true,
    },
  },
	{
    propertyName: MediaRssFields.Response,
    expect: {
      isArray: true,
      isNumber: undefined,
      isDate: undefined,
      newName: undefined,
      handled: true,
    },
  },
	{
    propertyName: MediaRssFields.Scene,
    expect: {
      isArray: true,
      isNumber: undefined,
      isDate: undefined,
      newName: undefined,
      handled: true,
    },
  }
].forEach((test) => {
  Deno.test(`MediaRssResolver:${test.propertyName}`, () => {
    const result = resolveMediaRssField(test.propertyName);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.handled, test.expect.handled, "handled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isNumber, test.expect.isNumber, "isNumber");
    assertEquals(result.newName, test.expect.newName, "newName");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
