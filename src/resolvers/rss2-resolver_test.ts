import { assert, assertEquals } from "../../test_deps.ts";
import { DublinCoreFields } from "../types/dublin-core.ts";
import { resolveRss2Field } from "./rss2-resolver.ts";
import { Rss2Fields } from "./types/rss2-fields.ts";

[
  {
    propertyName: "",
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "",
    },
  },
  {
    propertyName: Rss2Fields.TextInput,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "textInput",
    },
  },
  {
    propertyName: Rss2Fields.SkipHours,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "skipHours",
    },
  },
  {
    propertyName: Rss2Fields.SkipDays,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "skipDays",
    },
  },
  {
    propertyName: Rss2Fields.PubDate,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: true,
      propertyName: "pubDate",
    },
  },
  {
    propertyName: Rss2Fields.ManagingEditor,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "managingEditor",
    },
  },
  {
    propertyName: Rss2Fields.WebMaster,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "webMaster",
    },
  },
  {
    propertyName: Rss2Fields.LastBuildDate,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: true,
      propertyName: "lastBuildDate",
    },
  },
  {
    propertyName: Rss2Fields.Item,
    expect: {
      isArray: true,
      isNumber: false,
      isDate: false,
      propertyName: "items",
    },
  },
  {
    propertyName: Rss2Fields.Enclosure,
    expect: {
      isArray: true,
      isNumber: false,
      isDate: false,
      propertyName: Rss2Fields.Enclosure,
    },
  },
  {
    propertyName: Rss2Fields.Category,
    expect: {
      isArray: true,
      isNumber: false,
      isDate: false,
      propertyName: "categories",
    },
  },
  {
    propertyName: Rss2Fields.isPermaLink,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: false,
      propertyName: "isPermaLink",
    },
  },
  ...[
    Rss2Fields.Ttl,
    Rss2Fields.Length,
    Rss2Fields.Width,
    Rss2Fields.Height,
  ].map((field) => (
    {
      propertyName: field,
      expect: {
        isArray: false,
        isNumber: true,
        isDate: false,
        propertyName: field,
      },
    }
  )),
  {
    propertyName: Rss2Fields.Hour,
    expect: {
      isArray: true,
      isNumber: true,
      isDate: false,
      propertyName: Rss2Fields.Hour,
    },
  },
  {
    propertyName: Rss2Fields.Day,
    expect: {
      isArray: true,
      isNumber: false,
      isDate: false,
      propertyName: Rss2Fields.Day,
    },
  },
  {
    propertyName: DublinCoreFields.Date,
    expect: {
      isArray: false,
      isNumber: false,
      isDate: true,
      propertyName: DublinCoreFields.Date,
    },
  },
  {
    propertyName: DublinCoreFields.Valid,
    expect: {
      isArray: true,
      isNumber: false,
      isDate: true,
      propertyName: DublinCoreFields.Valid,
    },
  },
  {
    propertyName: DublinCoreFields.Creator,
    expect: {
      isArray: true,
      isNumber: false,
      isDate: false,
      propertyName: DublinCoreFields.Creator,
    },
  },
].forEach((test) => {
  Deno.test(`resolveRss2Field:${test.propertyName}`, () => {
    const [propertyName, isArray, isNumber, isDate] = resolveRss2Field(
      test.propertyName,
    );
    assertEquals(isArray, test.expect.isArray, "isArray");
    assertEquals(isNumber, test.expect.isNumber, "isNumber");
    assertEquals(propertyName, test.expect.propertyName, "");
    assertEquals(isDate, test.expect.isDate, "isDate");
  });
});
