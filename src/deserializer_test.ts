import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrowsAsync,
} from "../test_deps.ts";
import { deserializeFeed, parseFeed } from "./deserializer.ts";
import { Feed, MediaRss, RSS1 } from "../mod.ts";
import { FeedType } from "../mod.ts";
import type {
  Atom,
  DeserializationResult,
  JsonFeed,
  Options,
  RSS2,
} from "../mod.ts";
import type { TestEntry } from "./test/test_entry.ts";
import {
  DublinCoreFields,
  MediaRssFields,
  Rss2Fields,
  SlashFields,
} from "./types/fields/mod.ts";

const atomTestSample = await Deno.readTextFile("./samples/atom.xml");
const rss1TestSample = await Deno.readTextFile("./samples/rss1.xml");
const rss2TestSample = await Deno.readTextFile("./samples/rss2.xml");
const rss2DublinCoreTestSample = await Deno.readTextFile(
  "./samples/rss2_dublin-core.xml",
);

[undefined, null, ""].forEach((input: any) => {
  Deno.test(`Bad input: ${input}`, () => {
    assertThrowsAsync(async () => {
      await deserializeFeed(input);
    });
  });
});

Deno.test(`Unsupported format handling`, () => {
  assertThrowsAsync(async () => {
    await deserializeFeed("<test></test>");
  });
});

Deno.test(`Call signatures compile without error`, async () => {
  /* because this is a test only for the compiler, the condition is false, so
   * that none of the code will be executed, but it will still be type-checked
   */
  let n = 0;
  if (n > 0) {
    const result1 = await deserializeFeed(rss2TestSample);
    const result2 = await deserializeFeed(rss2TestSample, {
      outputJsonFeed: true,
    });
    const result3 = await deserializeFeed(rss2TestSample, {
      outputJsonFeed: false,
    });

    const options: Options = {};
    const result4 = await deserializeFeed(rss2TestSample, options);
  }
});

[
  {
    name: "LegacyRSS1",
    source: await deserializeFeed(rss1TestSample),
    tests: [
      {
        name: "Root",
        getValue: (src: DeserializationResult<RSS1>) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "FeedType",
        getValue: (src: DeserializationResult<RSS1>) => src.feedType,
        assert: [{ fn: assertEquals, expect: FeedType.Rss1 }],
      },
      {
        name: "Feed",
        getValue: (src: DeserializationResult<RSS1>) => src.feed,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.channel,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Title",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.channel.title,
        assert: [{ fn: assertEquals, expect: "RSS1:Title" }],
      },
      {
        name: "Feed:Channel:Link",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.channel.link,
        assert: [{ fn: assertEquals, expect: "RSS1:Link" }],
      },
      {
        name: "Feed:Channel:Description",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.channel.description,
        assert: [{ fn: assertEquals, expect: "RSS1:Description" }],
      },
      {
        name: "Feed:Item",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.item,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Item:Length",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.item.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Feed:Item:0:Title",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.item[0].title,
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:Title" }],
      },
      {
        name: "Feed:Item:0:Description",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0].description,
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:Description" }],
      },
      {
        name: "Feed:Item:0:DcCreator:0",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed?.item[0][DublinCoreFields.Creator]?.[0],
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:DCCreator" }],
      },
      {
        name: "Feed:Item:0:DcDate",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][DublinCoreFields.Date],
        assert: [{
          fn: assertEquals,
          expect: new Date("2021-07-24T10:00:00+00:00"),
        }],
      },
      {
        name: "Feed:Item:0:DcDateRaw",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][DublinCoreFields.DateRaw],
        assert: [{ fn: assertEquals, expect: "2021-07-24T10:00:00+00:00" }],
      },
      {
        name: "Feed:Item:0:DcSubject",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][DublinCoreFields.Subject],
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:SlashSubject" }],
      },
      {
        name: "Feed:Item:0:SlashDepartment",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][SlashFields.Department],
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:SlashDepartment" }],
      },
      {
        name: "Feed:Item:0:SlashSection",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][SlashFields.Section],
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:SlashSection" }],
      },
      {
        name: "Feed:Item:0:SlashComments",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][SlashFields.Comments],
        assert: [{ fn: assertEquals, expect: 1337 }],
      },
      {
        name: "Feed:Item:0:SlashHitParade",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.item[0][SlashFields.HitParade],
        assert: [{ fn: assertEquals, expect: "140,131,115,99,29,13,5" }],
      },
      {
        name: "Feed:TextInput",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.textInput,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:TextInput:Title",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.textInput.title,
        assert: [{ fn: assertEquals, expect: "RSS1:TextInput:Title" }],
      },
      {
        name: "Feed:TextInput:Description",
        getValue: (src: DeserializationResult<RSS1>) =>
          src.feed.textInput.description,
        assert: [{ fn: assertEquals, expect: "RSS1:TextInput:Description" }],
      },
      {
        name: "Feed:TextInput:Name",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.textInput.name,
        assert: [{ fn: assertEquals, expect: "RSS1:TextInput:Name" }],
      },
      {
        name: "Feed:TextInput:Link",
        getValue: (src: DeserializationResult<RSS1>) => src.feed.textInput.link,
        assert: [{
          fn: assertEquals,
          expect: "https://rss1-textinput-description.com",
        }],
      },
    ] as TestEntry<DeserializationResult<RSS1>>[],
  },
  {
    name: "LegacyRSS2",
    source: await deserializeFeed(rss2TestSample),
    tests: [
      {
        name: "Root",
        getValue: (src: DeserializationResult<RSS2>) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "FeedType",
        getValue: (src: DeserializationResult<RSS2>) => src.feedType,
        assert: [{ fn: assertEquals, expect: FeedType.Rss2 }],
      },
      {
        name: "Feed",
        getValue: (src: DeserializationResult<RSS2>) => src.feed,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Title",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel.title,
        assert: [{ fn: assertEquals, expect: "RSS2:Title:CData" }],
      },
      {
        name: "Feed:Channel:Description",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.description,
        assert: [{ fn: assertEquals, expect: "RSS2:Description:CData" }],
      },
      {
        name: "Feed:Channel:Generator",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.generator,
        assert: [{ fn: assertEquals, expect: "RSS2:Generator" }],
      },
      {
        name: "Feed:Channel:Link",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel.link,
        assert: [{ fn: assertEquals, expect: "https://RSS2-link.com/" }],
      },
      {
        name: "Feed:Channel:Generator",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.language,
        assert: [{ fn: assertEquals, expect: "RSS2:Language" }],
      },
      {
        name: "Feed:Channel:LastBuildDate",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.lastBuildDate,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:04 GMT"),
        }],
      },
      {
        name: "Feed:Channel:LastBuildDateRaw",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.lastBuildDateRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:04 GMT" }],
      },
      {
        name: "Feed:Channel:SkipDays",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipDays,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:SkipDays:Day",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipDays?.day,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:SkipDays:Day:Length",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipDays?.day?.length,
        assert: [{ fn: assertEquals, expect: 7 }],
      },
      {
        name: "Feed:Channel:SkipDays:Day:0",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipDays?.day?.[0],
        assert: [{ fn: assertEquals, expect: "Monday" }],
      },
      {
        name: "Feed:Channel:SkipDays:Day:6",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipDays?.day?.[6],
        assert: [{ fn: assertEquals, expect: "Sunday" }],
      },
      {
        name: "Feed:Channel:SkipHours",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipHours,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:SkipHours:Hour",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipHours?.hour,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:SkipHours:Hour:0",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipHours?.hour?.[0],
        assert: [{ fn: assertEquals, expect: 0 }],
      },
      {
        name: "Feed:Channel:SkipHours:Hour:23",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.skipHours?.hour?.[23],
        assert: [{ fn: assertEquals, expect: 23 }],
      },
      {
        name: "Feed:Channel:Docs",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel.docs,
        assert: [{ fn: assertEquals, expect: "https://RSS2-docs.com/" }],
      },
      {
        name: "Feed:Channel:ManagingEditor",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.managingEditor,
        assert: [{ fn: assertEquals, expect: "mail@wRSS2-managingEditor.com" }],
      },
      {
        name: "Feed:Channel:WebMaster",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.webMaster,
        assert: [{ fn: assertEquals, expect: "mail@RSS2-webMaster.com" }],
      },
      {
        name: "Feed:Channel:PubDate",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.pubDate,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "Feed:Channel:PubDateRaw",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.pubDateRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      {
        name: "Feed:Channel:Copyright",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.copyright,
        assert: [{ fn: assertEquals, expect: "RSS2:Copyright" }],
      },
      {
        name: "Feed:Channel:Ttl",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel.ttl,
        assert: [{ fn: assertEquals, expect: 100 }],
      },
      {
        name: "Feed:Channel:Image",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel.image,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Image:Url",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.image?.url,
        assert: [{ fn: assertEquals, expect: "RSS2-image.com" }],
      },
      {
        name: "Feed:Channel:Image:Title",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.image?.title,
        assert: [{ fn: assertEquals, expect: "RSS2:Image" }],
      },
      {
        name: "Feed:Channel:Image:Link",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.image?.link,
        assert: [{ fn: assertEquals, expect: "RSS2-image2.com" }],
      },
      {
        name: "Feed:Channel:Image:Height",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.image?.height,
        assert: [{ fn: assertEquals, expect: 69 }],
      },
      {
        name: "Feed:Channel:Image:Width",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.image?.width,
        assert: [{ fn: assertEquals, expect: 420 }],
      },
      {
        name: "Feed:Channel:Item",
        getValue: (src: DeserializationResult<RSS2>) => src.feed.channel.items,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Item:Length",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items.length,
        assert: [{ fn: assertEquals, expect: 11 }],
      },
      {
        name: "Feed:Channel:Item:0:Title",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].title,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Title:CData" }],
      },
      {
        name: "Feed:Channel:Item:0:Description",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].description,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Description:CData" }],
      },
      {
        name: "Feed:Channel:Item:0:Link",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].link,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-link.com/0",
        }],
      },
      {
        name: "Feed:Channel:Item:0:Guid",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].guid,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-link.com/0",
        }],
      },
      {
        name: "Feed:Channel:Item:0:Author",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].author,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Author" }],
      },
      {
        name: "Feed:Channel:Item:0:PubDate",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].pubDate,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "Feed:Channel:Item:0:PubDateRaw",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].pubDateRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      {
        name: "Feed:Channel:Item:0:Comments",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].comments,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-comment.com/0",
        }],
      },
      {
        name: "Feed:Channel:Item:0:Category",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].categories,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Item:0:Category:Length",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].categories?.length,
        assert: [{ fn: assertEquals, expect: 5 }],
      },
      {
        name: "Feed:Channel:Item:0:Category:0",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].categories?.[0],
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Category:0" }],
      },
      {
        name: "Feed:Channel:Item:0:Category:4",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0].categories?.[4],
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Category:4" }],
      },
      {
        name: "Feed:Channel:Item:0:MediaCredit",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Credit]?.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Media:Credit" }],
      },
      {
        name: "Feed:Channel:Item:0:MediaDescription",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Description]?.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Media:Description" }],
      },
      {
        name: "Feed:Channel:Item:0:MediaContent",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Content],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Item:0:MediaContent:Height",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Content]?.[0].height,
        assert: [{ fn: assertEquals, expect: 1337 }],
      },
      {
        name: "Feed:Channel:Item:0:MediaContent:Width",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Content]?.[0].width,
        assert: [{ fn: assertEquals, expect: 1337 }],
      },
      {
        name: "Feed:Channel:Item:0:MediaContent:Medium",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Content]?.[0].medium,
        assert: [{ fn: assertEquals, expect: "image" }],
      },
      {
        name: "Feed:Channel:Item:0:MediaContent:Url",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[0][MediaRssFields.Content]?.[0].url,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-media-content.com/",
        }],
      },
      {
        name: "Feed:Channel:Item:2:Media:Group",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[2][MediaRssFields.Group],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Item:2:Media:Group",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[2][MediaRssFields.Group]?.[0],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Item:2:Media:Group:Media:Content",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[2][MediaRssFields.Group]?.[0]
            ?.[MediaRssFields.Content],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Channel:Item:2:Media:Group:Media:Content:Length",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[2][MediaRssFields.Group]?.[0]
            ?.[MediaRssFields.Content]?.length,
        assert: [{ fn: assertEquals, expect: 5 }],
      },
      {
        name: "Feed:Channel:Item:8:Description - Self closing tag",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[8].description,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Feed:Channel:Item:9:DCCreator - Multiple DCCreators",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[9]["dc:creator"]?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Feed:Channel:Item:10:Description - Self Closing CData HTML",
        getValue: (src: DeserializationResult<RSS2>) =>
          src.feed.channel.items[10].description,
        assert: [{ fn: assertEquals, expect: '<img src="test" />' }],
      },
    ] as TestEntry<DeserializationResult<RSS2>>[],
  },
  {
    name: "LegacyAtom",
    source: await deserializeFeed(atomTestSample),
    tests: [
      {
        name: "Root",
        getValue: (src: DeserializationResult<Atom>) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "FeedType",
        getValue: (src: DeserializationResult<Atom>) => src.feedType,
        assert: [{ fn: assertEquals, expect: FeedType.Atom }],
      },
      {
        name: "Feed",
        getValue: (src: DeserializationResult<Atom>) => src.feed,
        assert: [
          { fn: assertNotEquals, expect: undefined },
          { fn: assertNotEquals, expect: null },
        ],
      },
      {
        name: "Feed:Title",
        getValue: (src: DeserializationResult<Atom>) => src.feed.title,
        assert: [
          { fn: assertNotEquals, expect: undefined },
          { fn: assertNotEquals, expect: null },
        ],
      },
      {
        name: "Feed:Title:Type",
        getValue: (src: DeserializationResult<Atom>) => src.feed.title.type,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Feed:Title:Value",
        getValue: (src: DeserializationResult<Atom>) => src.feed.title.value,
        assert: [{ fn: assertEquals, expect: "ATOM:Title" }],
      },
      {
        name: "Feed:Title:Links",
        getValue: (src: DeserializationResult<Atom>) => src.feed.links,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Title:Links:Length",
        getValue: (src: DeserializationResult<Atom>) => src.feed.links?.length,
        assert: [{ fn: assertEquals, expect: 1 }],
      },
      {
        name: "Feed:Icon",
        getValue: (src: DeserializationResult<Atom>) => src.feed.icon,
        assert: [{ fn: assertEquals, expect: "/AtomIcon.jpg" }],
      },
      {
        name: "Feed:Category",
        getValue: (src: DeserializationResult<Atom>) => src.feed.categories,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Category:length",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.categories?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Feed:Category:0",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.categories?.[0],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Category:0:Term",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.categories?.[0].term,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:0:Term" }],
      },
      {
        name: "Feed:Category:0:Label",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.categories?.[0].label,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:0:Label" }],
      },
      {
        name: "Feed:Category:1:Term",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.categories?.[1].term,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:1:Term" }],
      },
      {
        name: "Feed:Category:1:Label",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.categories?.[1].label,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:1:Label" }],
      },
      {
        name: "Feed:Updated",
        getValue: (src: DeserializationResult<Atom>) => src.feed.updated,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "Feed:UpdatedRaw",
        getValue: (src: DeserializationResult<Atom>) => src.feed.updatedRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Feed:Logo",
        getValue: (src: DeserializationResult<Atom>) => src.feed.logo,
        assert: [{ fn: assertEquals, expect: "Atom-Logo.com" }],
      },
      {
        name: "Feed:Subtitle",
        getValue: (src: DeserializationResult<Atom>) => src.feed.subtitle,
        assert: [{ fn: assertEquals, expect: "ATOM:Subtitle" }],
      },
      {
        name: "Feed:Author",
        getValue: (src: DeserializationResult<Atom>) => src.feed.author,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Author:Name",
        getValue: (src: DeserializationResult<Atom>) => src.feed.author?.name,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Author:Name" }],
      },
      {
        name: "Feed:Author:Email",
        getValue: (src: DeserializationResult<Atom>) => src.feed.author?.email,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Author:Email" }],
      },
      {
        name: "Feed:Author:Uri",
        getValue: (src: DeserializationResult<Atom>) => src.feed.author?.uri,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Author:Uri" }],
      },
      {
        name: "Feed:Author:Id",
        getValue: (src: DeserializationResult<Atom>) => src.feed.id,
        assert: [{
          fn: assertEquals,
          expect: "urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6",
        }],
      },
      {
        name: "Feed:Entry",
        getValue: (src: DeserializationResult<Atom>) => src.feed.entries,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:Length",
        getValue: (src: DeserializationResult<Atom>) => src.feed.entries.length,
        assert: [{ fn: assertEquals, expect: 4 }],
      },
      {
        name: "Feed:Entry:0",
        getValue: (src: DeserializationResult<Atom>) => src.feed.entries[0],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Title",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].title,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Title:Type",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].title.type,
        assert: [{ fn: assertEquals, expect: "xhtml" }],
      },
      {
        name: "Feed:Entry:0:Title:Value",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].title.value,
        assert: [{
          fn: assertEquals,
          expect:
            '<div xmlns="http://www.w3.org/1999/xhtml">HTML&Test Brough to you by<b>Test</b>!</div>',
        }],
      },
      {
        name: "Feed:Entry:0:Link",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].links,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Link:Length",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].links?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Feed:Entry:0:Link:0",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].links?.[0],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Link:0:Href",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].links?.[0].href,
        assert: [{
          fn: assertEquals,
          expect: "https://AtomLink.org/Entry/0/link",
        }],
      },
      {
        name: "Feed:Entry:0:Link:0:Rel",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].links?.[0].rel,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Link:Rel" }],
      },
      {
        name: "Feed:Entry:0:Link:0:Type",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].links?.[0].type,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Link:Type" }],
      },
      {
        name: "Feed:Entry:0:Published",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].published,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "Feed:Entry:0:PublishedRaw",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].publishedRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Feed:Entry:0:Id",
        getValue: (src: DeserializationResult<Atom>) => src.feed.entries[0].id,
        assert: [{
          fn: assertEquals,
          expect: "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da354efa6a",
        }],
      },
      {
        name: "Feed:Entry:0:Id",
        getValue: (src: DeserializationResult<Atom>) => src.feed.entries[0].id,
        assert: [{
          fn: assertEquals,
          expect: "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da354efa6a",
        }],
      },
      {
        name: "Feed:Entry:0:Updated",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].updated,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "Feed:Entry:0:UpdatedRaw",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].updatedRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Feed:Entry:0:Summary",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].summary,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Summary:Type",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].summary?.type,
        assert: [{ fn: assertEquals, expect: "xhtml" }],
      },
      {
        name: "Feed:Entry:0:Summary:Value",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].summary?.value,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Summary" }],
      },
      {
        name: "Feed:Entry:0:Author",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].author,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Author:Email",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].author?.email,
        assert: [{
          fn: assertEquals,
          expect: "ATOM:Feed:Entry:0:Author:Email",
        }],
      },
      {
        name: "Feed:Entry:0:Author:Name",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].author?.name,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Author:Name" }],
      },
      {
        name: "Feed:Entry:0:Author:Uri",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].author?.uri,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Author:Uri" }],
      },
      {
        name: "Feed:Entry:0:Content",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].content,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Content:Value",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].content?.value,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Content" }],
      },
      {
        name: "Feed:Entry:0:Category",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].categories,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Category:Length",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].categories?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Feed:Entry:0:Category:0",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].categories?.[0],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Category:0:Term",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].categories?.[0].term,
        assert: [{
          fn: assertEquals,
          expect: "ATOM:Feed:Entry:0:Category:0:Term",
        }],
      },
      {
        name: "Feed:Entry:0:Category:0:Label",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].categories?.[0].label,
        assert: [{
          fn: assertEquals,
          expect: "ATOM:Feed:Entry:0:Category:0:Label",
        }],
      },
      {
        name: "Feed:Entry:0:Source",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].source,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Source:Id",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].source?.id,
        assert: [{ fn: assertEquals, expect: "ATOM:Feed:Entry:0:Source:Id" }],
      },
      {
        name: "Feed:Entry:0:Source:Title",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].source?.title,
        assert: [{
          fn: assertEquals,
          expect: "ATOM:Feed:Entry:0:Source:Title",
        }],
      },
      {
        name: "Feed:Entry:0:Source:Updated",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].source?.updated,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "Feed:Entry:0:Source:UpdatedRaw",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].source?.updatedRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Feed:Entry:0:Contributor",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].contributors,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Contributor:Length",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].contributors?.length,
        assert: [{ fn: assertEquals, expect: 1 }],
      },
      {
        name: "Feed:Entry:0:Contributor:0:Name",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].contributors?.[0].name,
        assert: [{
          fn: assertEquals,
          expect: "ATOM:Feed:Entry:0:Contributor:Name",
        }],
      },
      // TODO(MikaelPorttila): Add the other contributor fields.
      {
        name: "Feed:Entry:0:Rights",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].rights,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Feed:Entry:0:Rights:Type",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].rights?.type,
        assert: [{ fn: assertEquals, expect: "html" }],
      },
      {
        name: "Feed:Entry:0:Rights:Value",
        getValue: (src: DeserializationResult<Atom>) =>
          src.feed.entries[0].rights?.value,
        assert: [{ fn: assertEquals, expect: "&copy; 2020 Micke" }],
      },
    ] as TestEntry<DeserializationResult<Atom>>[],
  },
  {
    name: "JsonFeed(Atom)",
    source: await deserializeFeed(atomTestSample, { outputJsonFeed: true }),
    tests: [
      {
        name: "OriginalFeedType",
        getValue: (
          src: DeserializationResult<Atom | RSS1 | RSS2 | JsonFeed> & {
            originalFeedType?: FeedType;
          },
        ) => src.originalFeedType,
        assert: [{ fn: assertEquals, expect: FeedType.Atom }],
      },
    ] as TestEntry<
      DeserializationResult<Atom | RSS1 | RSS2 | JsonFeed> & {
        originalFeedType?: FeedType;
      }
    >[],
  },
].forEach((workspace) => {
  workspace.tests.forEach((test) => {
    Deno.test(`parseFeed:${workspace.name}:${test.name}`, () => {
      const target = test.getValue((workspace as any).source);
      test.assert.forEach((assertion) => assertion.fn(target, assertion.expect));
    });
  });
});

Deno.test("Deserialize RSS2 with convertToJsonFeed option", async () => {
  const { feed, feedType } = await deserializeFeed(rss2TestSample, {
    outputJsonFeed: true,
  });

  assert(!!feed, "Result was undefined");
  assertEquals(feedType, FeedType.JsonFeed);
});

/*
	(New) Parse Feed Tests
*/

[
  {
    name: "RSS1",
    source: await parseFeed(rss1TestSample),
    tests: [
      {
        name: "Root",
        getValue: (src: Feed) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Type",
        getValue: (src: Feed) => src.type,
        assert: [{ fn: assertEquals, expect: FeedType.Rss1 }],
      },
      {
        name: "Title",
        getValue: (src: Feed) => src.title.value,
        assert: [{ fn: assertEquals, expect: "RSS1:Title" }],
      },
      {
        name: "DCRights",
        getValue: (src: Feed) => src.copyright,
        assert: [{ fn: assertEquals, expect: "RSS1:DcRights" }],
      },
      {
        name: "Link",
        getValue: (src: Feed) => src.links,
        assert: [{ fn: assertNotEquals, expect: undefined }],
      },
      {
        name: "Link",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "RSS1:Link" }],
      },
      {
        name: "Image",
        getValue: (src: Feed) => src.image,
        assert: [{ fn: assertNotEquals, expect: undefined }],
      },
      {
        name: "Image:Url",
        getValue: (src: Feed) => src.image?.url,
        assert: [{ fn: assertEquals, expect: "RSS1:Image:Url" }],
      },
      {
        name: "Image:Title",
        getValue: (src: Feed) => src.image?.title,
        assert: [{ fn: assertEquals, expect: "RSS1:Image:Title" }],
      },
      {
        name: "Image:Link",
        getValue: (src: Feed) => src.image?.link,
        assert: [{ fn: assertEquals, expect: "RSS1:Image:Link" }],
      },
      {
        name: "Description",
        getValue: (src: Feed) => src.description,
        assert: [{ fn: assertEquals, expect: "RSS1:Description" }],
      },
    ] as TestEntry<Feed>[],
  },
  {
    name: "RSS2",
    source: await parseFeed(rss2TestSample),
    tests: [
      {
        name: "Root",
        getValue: (src: Feed) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Type",
        getValue: (src: Feed) => src.type,
        assert: [{ fn: assertEquals, expect: FeedType.Rss2 }],
      },
      {
        name: "Title",
        getValue: (src: Feed) => src.title,
        assert: [{ fn: assertNotEquals, expect: undefined }],
      },
      {
        name: "Title:Type",
        getValue: (src: Feed) => src.title.type,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Title:Value",
        getValue: (src: Feed) => src.title.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Title:CData" }],
      },
      {
        name: "Description",
        getValue: (src: Feed) => src.description,
        assert: [{ fn: assertEquals, expect: "RSS2:Description:CData" }],
      },
      {
        name: "Language",
        getValue: (src: Feed) => src.language,
        assert: [{ fn: assertEquals, expect: "RSS2:Language" }],
      },
      {
        name: "Uri",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "https://RSS2-link.com/" }],
      },
      {
        name: "Image",
        getValue: (src: Feed) => src.image,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Image:Url",
        getValue: (src: Feed) => src.image?.url,
        assert: [{ fn: assertEquals, expect: "RSS2-image.com" }],
      },
      {
        name: "Image:Title",
        getValue: (src: Feed) => src.image?.title,
        assert: [{ fn: assertEquals, expect: "RSS2:Image" }],
      },
      {
        name: "Image:Link",
        getValue: (src: Feed) => src.image?.link,
        assert: [{ fn: assertEquals, expect: "RSS2-image2.com" }],
      },
      {
        name: "Image:Height",
        getValue: (src: Feed) => src.image?.height,
        assert: [{ fn: assertEquals, expect: 69 }],
      },
      {
        name: "Image:Width",
        getValue: (src: Feed) => src.image?.width,
        assert: [{ fn: assertEquals, expect: 420 }],
      },
      {
        name: "PubDate",
        getValue: (src: Feed) => src.published,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "PubDateRaw",
        getValue: (src: Feed) => src.publishedRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      {
        name: "LastBuildDate",
        getValue: (src: Feed) => src.updateDate,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:04 GMT"),
        }],
      },
      {
        name: "LastBuildDateRaw",
        getValue: (src: Feed) => src.updateDateRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:04 GMT" }],
      },
      {
        name: "Generator",
        getValue: (src: Feed) => src.generator,
        assert: [{ fn: assertEquals, expect: "RSS2:Generator" }],
      },
      {
        name: "Copyright",
        getValue: (src: Feed) => src.copyright,
        assert: [{ fn: assertEquals, expect: "RSS2:Copyright" }],
      },
      {
        name: "SkipDays",
        getValue: (src: Feed) => src.skipDays,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "SkipDays:Length",
        getValue: (src: Feed) => src.skipDays?.length,
        assert: [{ fn: assertEquals, expect: 7 }],
      },
      {
        name: "SkipHours",
        getValue: (src: Feed) => src.skipHours,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "SkipHours:Length",
        getValue: (src: Feed) => src.skipHours?.length,
        assert: [{ fn: assertEquals, expect: 24 }],
      },
      {
        name: "Ttl",
        getValue: (src: Feed) => src.ttl,
        assert: [{ fn: assertEquals, expect: 100 }],
      },
      {
        name: "Items",
        getValue: (src: Feed) => src.entries,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Items:Length",
        getValue: (src: Feed) => src.entries.length,
        assert: [{ fn: assertEquals, expect: 11 }],
      },
      {
        name: "Items:[0]:Title:Type",
        getValue: (src: Feed) => src.entries[0].title?.type,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:[0]:Title:Value",
        getValue: (src: Feed) => src.entries[0].title?.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Title:CData" }],
      },
      {
        name: "Items:[0]:Author",
        getValue: (src: Feed) => src.entries[0].author,
        assert: [{
          fn: assertNotEquals,
          expect: undefined,
        }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Items:[0]:Enclosure",
        getValue: (src: Feed) => src.entries[0].attachments,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Items:[0]:Enclosure:Length",
        getValue: (src: Feed) => src.entries[0].attachments?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Items:[0]:Enclosure:0:Url",
        getValue: (src: Feed) => src.entries[0].attachments?.[0].url,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-enclosure-0-url.mp3",
        }],
      },
      {
        name: "Items:[0]:Enclosure:1:Url",
        getValue: (src: Feed) => src.entries[0].attachments?.[1].url,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-enclosure-1-url.mp3",
        }],
      },
      {
        name: "Items:[0]:Enclosure:0:Type",
        getValue: (src: Feed) => src.entries[0].attachments?.[0].mimeType,
        assert: [{ fn: assertEquals, expect: "audio/mpeg" }],
      },
      {
        name: "Items:[0]:Enclosure:0:Length",
        getValue: (src: Feed) => src.entries[0].attachments?.[0].sizeInBytes,
        assert: [{ fn: assertEquals, expect: 24986239 }],
      },
      {
        name: "Items:[0]:Author:Name",
        getValue: (src: Feed) => src.entries[0]?.author?.name,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Item:0:Author",
        }],
      },
      {
        name: "Items:[0]:ContentEncoded:Value",
        getValue: (src: Feed) => src.entries[0].content?.value,
        assert: [{ fn: assertEquals, expect: "<RSS2:Item:0:ConentEncoded:CData></RSS2:Item:0:ConentEncoded:CData>" }],
      },
      {
        name: "Items:[0]:Guid",
        getValue: (src: Feed) => src.entries[0].id,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-link.com/0",
        }],
      },
      {
        name: "Items:[0]:Media:Credit",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Credit]?.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Media:Credit" }],
      },
      {
        name: "Items:[0]:Media:Description",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Description]?.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Media:Description" }],
      },
      {
        name: "Items:[0]:Media:Content",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Content],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Items:[0]:Media:Content:Url",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].url,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-media-content.com/",
        }],
      },
      {
        name: "Items:[0]:Media:Content:Medium",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].medium,
        assert: [{ fn: assertEquals, expect: "image" }],
      },
      {
        name: "Items:[0]:Media:Content:Width",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].width,
        assert: [{ fn: assertEquals, expect: 1337 }],
      },
      {
        name: "Items:[0]:Media:Content:Height",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].height,
        assert: [{ fn: assertEquals, expect: 1337 }],
      },
      {
        name: "Items:[0]:DC:Creator:Length",
        getValue: (src: Feed) =>
          src.entries[0][DublinCoreFields.Creator]?.length,
        assert: [{ fn: assertEquals, expect: 1 }],
      },
      {
        name: "Items:[0]:DC:Creator[0]:Value",
        getValue: (src: Feed) => src.entries[0][DublinCoreFields.Creator]?.[0],
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:DC:Creator" }],
      },
      {
        name: "Items:[0]:Description:Type",
        getValue: (src: Feed) => src.entries[0].description?.type,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:[0]:Description:Value",
        getValue: (src: Feed) => src.entries[0].description?.value,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Description:CData" }],
      },
      {
        name: "Items:[0]:Link",
        getValue: (src: Feed) => src.entries[0].links[0].href,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-link.com/0",
        }],
      },
      {
        name: "Items:[0]:Comments",
        getValue: (src: Feed) => src.entries[0].comments,
        assert: [{
          fn: assertEquals,
          expect: "https://RSS2-entry-0-comment.com/0",
        }],
      },
      {
        name: "Items:[0]:PubDate",
        getValue: (src: Feed) => src.entries[0].published,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "Items:[0]:PubDateRaw",
        getValue: (src: Feed) => src.entries[0].publishedRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      {
        name: "Items:[0]:PubDate->Updated",
        getValue: (src: Feed) => src.entries[0].updated,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "Items:[0]:PubDateRaw->UpdatedRaw",
        getValue: (src: Feed) => src.entries[0].updatedRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      {
        name: "Items:[0]:Category",
        getValue: (src: Feed) => src.entries[0].categories,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Items:[0]:Category:Length",
        getValue: (src: Feed) => src.entries[0].categories?.length,
        assert: [{ fn: assertEquals, expect: 5 }],
      },
      {
        name: "Items:[0]:Category[0]:Term",
        getValue: (src: Feed) => src.entries[0].categories?.[0].term,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Category:0" }],
      },
      {
        name: "Items:[0]:Category[0]:Label",
        getValue: (src: Feed) => src.entries[0].categories?.[0].label,
        assert: [{ fn: assertEquals, expect: "RSS2:Item:0:Category:0" }],
      },
      // Edge case item checks
      {
        name: "Items:[8]:Description - Self closing tag",
        getValue: (src: Feed) => src.entries[8].description,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:[9]:Creators - Multiple DCCreators",
        getValue: (src: Feed) => src.entries[9]["dc:creator"]?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Items:[9]:DCCreator - Multiple DCCreators",
        getValue: (src: Feed) => src.entries[9]["dc:creator"]?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Items:[6]:FeedburnerOrigLink - Feedburner link",
        getValue: (src: Feed) => src.entries[6].links?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Items:[6]:FeedburnerOrigLink - Feedburner link",
        getValue: (src: Feed) => src.entries[6].links[0]?.href,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Item:6:FeedburnerOrigLink",
        }],
      },
    ] as TestEntry<Feed>[],
  },
  {
    name: "RSS2:DublinCore",
    source: await parseFeed(rss2DublinCoreTestSample),
    tests: [] as TestEntry<Feed>[],
  },
  {
    name: "Atom",
    source: await parseFeed(atomTestSample),
    tests: [
      {
        name: "Root",
        getValue: (src: Feed) => src,
        assert: [{
          fn: assertNotEquals,
          expect: undefined,
        }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Type",
        getValue: (src: Feed) => src.type,
        assert: [{ fn: assertEquals, expect: FeedType.Atom }],
      },
      {
        name: "Icon",
        getValue: (src: Feed) => src.icon,
        assert: [{ fn: assertEquals, expect: "/AtomIcon.jpg" }],
      },
      {
        name: "Updated",
        getValue: (src: Feed) => src.updateDate,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "UpdatedRaw",
        getValue: (src: Feed) => src.updateDateRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Title",
        getValue: (src: Feed) => src.title,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Title:Type",
        getValue: (src: Feed) => src.title.type,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Title:Value",
        getValue: (src: Feed) => src.title.value,
        assert: [{ fn: assertEquals, expect: "ATOM:Title" }],
      },
      {
        name: "Category",
        getValue: (src: Feed) => src.categories,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Category:Length",
        getValue: (src: Feed) => src.categories.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Category:[0]:Term",
        getValue: (src: Feed) => src.categories[0].term,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:0:Term" }],
      },
      {
        name: "Category:[1]:Term",
        getValue: (src: Feed) => src.categories[1].term,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:1:Term" }],
      },
      {
        name: "Image",
        getValue: (src: Feed) => src.image,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Image:Url",
        getValue: (src: Feed) => src.image?.url,
        assert: [{ fn: assertEquals, expect: "Atom-Logo.com" }],
      },
      {
        name: "Image:Title",
        getValue: (src: Feed) => src.image?.title,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Image:Link",
        getValue: (src: Feed) => src.image?.link,
        assert: [{ fn: assertEquals, expect: "Atom-Logo.com" }],
      },
      {
        name: "Image:Height",
        getValue: (src: Feed) => src.image?.height,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Image:Width",
        getValue: (src: Feed) => src.image?.width,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Link",
        getValue: (src: Feed) => src.links,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Link:length",
        getValue: (src: Feed) => src.links.length,
        assert: [{ fn: assertEquals, expect: 1 }],
      },
      {
        name: "Link:Href",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "https://AtomLink.org/" }],
      },
      {
        name: "Entry",
        getValue: (src: Feed) => src.entries,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Entry:Length",
        getValue: (src: Feed) => src.entries.length,
        assert: [{ fn: assertEquals, expect: 4 }],
      },
      {
        name: "Entry:[0]:Title",
        getValue: (src: Feed) => src.entries[0].title,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Entry:[0]:Title:Type",
        getValue: (src: Feed) => src.entries[0].title?.type,
        assert: [{ fn: assertEquals, expect: "xhtml" }],
      },
      {
        name: "Entry:[0]:Title:Value",
        getValue: (src: Feed) => src.entries[0].title?.value,
        assert: [{
          fn: assertEquals,
          expect:
            `<div xmlns="http://www.w3.org/1999/xhtml">HTML&Test Brough to you by<b>Test</b>!</div>`,
        }],
      },
      {
        name: "Entry:[0]:Link",
        getValue: (src: Feed) => src.entries[0].links[0].href,
        assert: [{
          fn: assertEquals,
          expect: "https://AtomLink.org/Entry/0/link",
        }],
      },
      {
        name: "Entry:[1]:Feedburner:OrigLink",
        getValue: (src: Feed) => src.entries[1].links[0].href,
        assert: [{
          fn: assertEquals,
          expect: "https://AtomFeedburner.org/Entry/1",
        }],
      },
      {
        name: "Entry:[0]:Published",
        getValue: (src: Feed) => src.entries[0].published,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "Entry:[0]:PublishedRaw",
        getValue: (src: Feed) => src.entries[0].publishedRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Entry:[0]:Updated",
        getValue: (src: Feed) => src.entries[0].updated,
        assert: [{
          fn: assertEquals,
          expect: new Date("2003-12-13T18:30:02Z"),
        }],
      },
      {
        name: "Entry:[0]:UpdatedRaw",
        getValue: (src: Feed) => src.entries[0].updatedRaw,
        assert: [{ fn: assertEquals, expect: "2003-12-13T18:30:02Z" }],
      },
      {
        name: "Entry:[3]:UpdatedRaw:Title - SelfClosing CData",
        getValue: (src: Feed) => src.entries[3].title?.value,
        assert: [{
          fn: assertEquals,
          expect: '<div><img src="test" /><img src="test2" /></div>',
        }],
      },
      {
        name: "Entry:[3]:UpdatedRaw:Summary - SelfClosing CData",
        getValue: (src: Feed) => src.entries[3].description?.value,
        assert: [{
          fn: assertEquals,
          expect: '<div><img src="test" /><img src="test2" /></div>',
        }],
      },
      {
        name: "Entry:[2]:media:group - Nestd MediaRSS group",
        getValue: (src: Feed) => src.entries[2]?.[MediaRss.Group]?.[MediaRss.Community]?.[MediaRss.Statistics]?.views,
        assert: [{
          fn: assertEquals,
          expect: "1337",
        }],
      },
    ] as TestEntry<Feed>[],
  },
].forEach((workspace) => {
  workspace.tests.forEach((test) => {
    Deno.test(`parseFeed:${workspace.name}:${test.name}`, () => {
      const target = test.getValue(workspace.source);
      test.assert.forEach((assertion) => assertion.fn(target, assertion.expect));
    });
  });
});
