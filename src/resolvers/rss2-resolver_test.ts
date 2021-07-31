import { assertEquals } from "../../test_deps.ts";
import { DublinCoreFields, Rss2Fields } from "../types/fields/mod.ts";
import { resolveRss2Field } from "./rss2-resolver.ts";

[
  {
    name: "",
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "",
    },
  },
  {
    name: Rss2Fields.TextInput,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "textInput",
    },
  },
  {
    name: Rss2Fields.SkipHours,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "skipHours",
    },
  },
  {
    name: Rss2Fields.SkipDays,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "skipDays",
    },
  },
  {
    name: Rss2Fields.PubDate,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: true,
      name: "pubDate",
    },
  },
  {
    name: Rss2Fields.ManagingEditor,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "managingEditor",
    },
  },
  {
    name: Rss2Fields.WebMaster,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "webMaster",
    },
  },
  {
    name: Rss2Fields.LastBuildDate,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: true,
      name: "lastBuildDate",
    },
  },
  {
    name: Rss2Fields.Item,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "items",
    },
  },
  {
    name: Rss2Fields.Enclosure,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: Rss2Fields.Enclosure,
    },
  },
  {
    name: Rss2Fields.Category,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "categories",
    },
  },
  {
    name: Rss2Fields.isPermaLink,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: "isPermaLink",
    },
  },
  ...[
    Rss2Fields.Ttl,
    Rss2Fields.Length,
    Rss2Fields.Width,
    Rss2Fields.Height,
  ].map((field) => (
    {
      name: field,
      expect: {
        isArray: false,
        isInt: true,
        isFloat: false,
        isDate: false,
        name: field,
      },
    }
  )),
  {
    name: Rss2Fields.Hour,
    expect: {
      isArray: true,
      isInt: true,
      isFloat: false,
      isDate: false,
      name: Rss2Fields.Hour,
    },
  },
  {
    name: Rss2Fields.Day,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: Rss2Fields.Day,
    },
  },
  {
    name: DublinCoreFields.Date,
    expect: {
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: true,
      name: DublinCoreFields.Date,
    },
  },
  {
    name: DublinCoreFields.Valid,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: true,
      name: DublinCoreFields.Valid,
    },
  },
  {
    name: DublinCoreFields.Creator,
    expect: {
      isArray: true,
      isInt: false,
      isFloat: false,
      isDate: false,
      name: DublinCoreFields.Creator,
    },
  },
].forEach((test) => {
  Deno.test(`resolveRss2Field:${test.name}`, () => {
    const { isArray, isInt, isFloat, name, isDate } = resolveRss2Field(
      test.name,
    );
    assertEquals(
      isArray,
      test.expect.isArray,
      `isArray - Expect: ${test.expect.isArray}, Actual: ${isArray}`,
    );
    assertEquals(
      isInt,
      test.expect.isInt,
      `IsInt - Expect: ${test.expect.isInt}, Actual: ${isInt}`,
    );
    assertEquals(
      isFloat,
      test.expect.isFloat,
      `isFloat - Expect: ${test.expect.isFloat}, Actual: ${isFloat}`,
    );
    assertEquals(
      name,
      test.expect.name,
      `name - Expect: ${test.expect.name}, Actual: ${name}`,
    );
    assertEquals(
      isDate,
      test.expect.isDate,
      `isDate - Expect: ${test.expect.isDate}, Actual: ${isDate}`,
    );
  });
});
