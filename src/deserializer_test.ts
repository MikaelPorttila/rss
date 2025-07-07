import { assertEquals, assertNotEquals, assertRejects } from "../test_deps.ts";
import { parseFeed } from "./deserializer.ts";
import { Feed, MediaRss } from "../mod.ts";
import { FeedType } from "../mod.ts";
import type { TestEntry } from "./test/test_entry.ts";
import { DublinCoreFields } from "./types/fields/dublin_core_fields.ts";
import { MediaRssFields } from "./types/fields/media_rss_fields.ts";

const atomTestSample = await Deno.readTextFile("./samples/atom.xml");
const rss1TestSample = await Deno.readTextFile("./samples/rss1.xml");
const rss2TestSample = await Deno.readTextFile("./samples/rss2.xml");
const rss2DublinCoreTestSample = await Deno.readTextFile(
  "./samples/rss2_dublin-core.xml",
);

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
        assert: [{
          fn: assertEquals,
          expect:
            "<RSS2:Item:0:ConentEncoded:CData></RSS2:Item:0:ConentEncoded:CData>",
        }],
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
        getValue: (src: Feed) => src.categories?.length,
        assert: [{ fn: assertEquals, expect: 2 }],
      },
      {
        name: "Category:[0]:Term",
        getValue: (src: Feed) => src.categories?.[0].term,
        assert: [{ fn: assertEquals, expect: "ATOM:Category:0:Term" }],
      },
      {
        name: "Category:[1]:Term",
        getValue: (src: Feed) => src.categories?.[1].term,
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
        getValue: (src: Feed) =>
          src.entries[2]?.[MediaRss.Group]?.[MediaRss.Community]
            ?.[MediaRss.Statistics]?.views,
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
      test.assert.forEach((assertion) =>
        assertion.fn(target, assertion.expect)
      );
    });
  });
});

Deno.test("Should throw error on invalid feed format", async () => {
  await assertRejects(
    () => parseFeed("Invalid feed string"),
    Error,
    "Invalid or unsupported feed format",
  );
});

Deno.test("Should throw error on unsupported feed format", async () => {
  const futureRSSFormat = `
    <?xml version="1.0" encoding="UTF-8"?>
    <xrss version="X.0" xmlns:media="http://schema.loremipsumuru.com/xrss/">
      <channel>
        <title>Future RSS Feed</title>
        <link>https://example.com</link>
        <description>An RSS feed from the future</description>
        <language>en-us</language>
        <lastBuildDate>[Last updated timestamp]</lastBuildDate>
        <generator>FutureRSSGenerator v1.0</generator>
        <pubDate>[Publication timestamp]</pubDate>
        <copyright>Copyright © [Year] by [Your Organization]</copyright>
        <managingEditor>[Editor's email]</managingEditor>
        <webMaster>[Webmaster's email]</webMaster>
        <image>
          <url>https://example.com/logo.png</url>
          <title>Future RSS Feed</title>
          <link>https://example.com</link>
        </image>
        <item>
          <title>[Title of the article]</title>
          <link>[Link to the article]</link>
          <description>[Description of the article]</description>
          <author>[Author's name]</author>
          <category>[Category of the article]</category>
          <pubDate>[Publication timestamp]</pubDate>
          <media:content url="[URL to media file]" type="[Media type]" vr="true" />
          <media:vrFormat>360-degree video</media:vrFormat>
          <media:vrPlatform>Oculus Rift</media:vrPlatform>
        </item>
        <!-- Additional items go here -->
      </channel>
    </xrss>
  `;
  await assertRejects(
    () => parseFeed(futureRSSFormat),
    Error,
    "Type xrss is not supported",
  );
});

Deno.test("Test empty node", async () => {
  const feed = await parseFeed(`<rss version="2.0"
	>
  <channel>
    <item>
      <dc:creator><![CDATA[]]></dc:creator>
    </item>
  </channel>
  </rss>`);
  feed.entries[0].author?.name?.substring(0,1)
})
