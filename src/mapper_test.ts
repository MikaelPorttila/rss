import {
  assert,
  assertEquals,
  assertThrowsAsync,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { Feed, RSS2, FeedType } from "./types/mod.ts";
import { toJsonFeed } from "./mapper.ts";

const date = new Date(1989, 1, 1);

Deno.test("Mapper ATOM -> JSON Feed", () => {
  const atom = {
    id: "id",
    icon: "icon",
    title: {
      type: "text",
      value: "title.value",
    },
    links: [{
      href: "links.href.self",
      rel: "self",
    }, {
      href: "links.href.alternateOrEmpty",
      rel: "alternate",
    }
    ],
    updated: date,
    entries: [{
      id: "entry.id",
      updated: date,
      published: date,
      links: [
        {
          href: 'link.href.enclosure',
          rel: "enclosure",
          length: 1337,
          type: "image/test"
        }
      ],
      title: {
        type: 'text',
        value: 'entry.title.type.text.value'
      },
      categories: ["entry.category1", "entry.category2"],
      summary: {
        type: "text",
        value: "entry.summary.type.text.value",
      },
      content: {
        type: "text",
        value: "entry.content.type.text.value",
      },
    }, {
      id: "entry.id2",
      summary: {
        type: "xhtml",
        value: "entry.summary.type.xhtml.value",
      },
      content: {
        type: "xhtml",
        value:
          "<entry.content.type.xhtml.value></<entry.content.type.xhtml.value>",
      },
    }],
    author: {
      name: "author.name",
      uri: "author.url",
    },
  } as Feed;

  const jsonFeed = toJsonFeed(FeedType.Atom, atom);
  assert(!!jsonFeed, "toJsonFeed result was undefined");
  assertEquals(jsonFeed.version, undefined, "version should be undefined");
  assertEquals(jsonFeed.title, "title.value", "Atom title was not mapped");
  assertEquals(jsonFeed.icon, "icon", "Atom icon was not mapped");
  assertEquals(jsonFeed.home_page_url, "links.href.self");
  assertEquals(jsonFeed.feed_url, "links.href.alternateOrEmpty");

  assert(!!jsonFeed.author, "Atom author was not mapped");
  assertEquals(
    jsonFeed.author.name,
    "author.name",
    "Atom author name was not mapped",
  );
  assertEquals(
    jsonFeed.author.url,
    "author.url",
    "Atom author url was not mapped",
  );

  assert(!!jsonFeed.items, "Atom entries was not mapped");
  assertEquals(
    jsonFeed.items[0].id,
    "entry.id",
    "Atom entry id was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].title,
    "entry.title.type.text.value",
    "Atom entry title was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].date_modified,
    new Date(1989, 1, 1),
    "Atom entry updated was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].date_published,
    new Date(1989, 1, 1),
    "Atom entry published was not mapped",
  );
  assert(
    !!jsonFeed.items[0].tags,
    "Atom entry category was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].tags.length,
    2,
    "Atom entry category length was mismatching",
  );
  assertEquals(
    jsonFeed.items[0].tags[0],
    "entry.category1",
    "Atom entry category 1 was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].tags[1],
    "entry.category2",
    "Atom entry category 2 was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].summary,
    "entry.summary.type.text.value",
    "Atom entry summary was not mapped",
  );
  assertEquals(
    jsonFeed.items[0].content_text,
    "entry.content.type.text.value",
    "Atom entry content with type text was not mapped",
  );
  assertEquals(
    jsonFeed.items[1].content_html,
    "<entry.content.type.xhtml.value></<entry.content.type.xhtml.value>",
    "Atom entry content with type xhtml was not mapped",
  );
  assert(!!jsonFeed.items[0].attachments, 'Atom enclosure link was not mapped');
  assert(!!jsonFeed.items[0].attachments[0], 'Atom enclosure link was not mapped');
  assertEquals(jsonFeed.items[0].attachments[0].url, 'link.href.enclosure', 'Atom enclosure link href was not mapped');
  assertEquals(jsonFeed.items[0].attachments[0].size_in_bytes, 1337, 'Atom enclosure link size was not mapped');
  assertEquals(jsonFeed.items[0].attachments[0].mime_type, "image/test", 'Atom enclosure link type was not mapped');
  assertEquals(jsonFeed.items[0].attachments[0].title, undefined, 'Attachment title was not undefined');
  assertEquals(jsonFeed.items[0].attachments[0].duration_in_seconds, undefined, 'Attachment title was not undefined');
});

Deno.test("Mapper RSS2 -> JSON Feed", () => {
  const rss: RSS2 = {
    version: 2,
    channel: {
      title: 'title',
      link: 'link',
      description: 'description',
      managingEditor: 'managingEditor',
      webMaster: 'webMaster',
      image: {
        url: 'image.url',
        title: 'image.title',
        link: 'image.link'
      },
      items: [{
        guid: 'item.guid',
        title: 'item.title',
        description: 'item.description',
        author: 'item.author',
        link: 'item.link',
        comments: 'item.comments',
        categories: ['item.link.category1', 'item.link.category2'],
        pubDate: new Date(1989, 1, 1),
        enclosure: {
          url: 'enclosure.url',
          length: 1337,
          type: 'enclosure.type'
        }
      }],
      cloud: {
        domain: 'cloud.domain',
        port: 1337,
        path: '/cloud.path',
        registerProcedure: 'cloud.registerProcedure',
        protocol: 'cloud.protocol'
      }
    }
  };

  const jsonFeed = toJsonFeed(FeedType.Rss2, rss);
  // Channel
  assert(!!jsonFeed, 'toJsonFeed result was undefined');
  assertEquals(jsonFeed.title, 'title', 'RSS title was not mapped');
  assertEquals(jsonFeed.description, 'description', 'RSS description was not mapped');
  // Author
  assert(!!jsonFeed.author, 'author field is undefined, RSS webMaster or managingEditor was not mapped');
  assertEquals(jsonFeed.author.url,'managingEditor', 'RSS webMaster or managingEditor was not mapped');
  assert(!!jsonFeed.icon, 'RSS Image was not mapped');
  assertEquals(jsonFeed.icon, 'image.url', 'RSS Image was not mapped');
  assertEquals(jsonFeed.home_page_url, 'link', 'RSS link was not mapped');
  // hub
  assert(!!jsonFeed.hubs, 'RSS cloud was not mapped');
  assertEquals(jsonFeed.hubs[0].type, 'cloud.protocol');
  assertEquals(jsonFeed.hubs[0].url, 'cloud.domain:1337/cloud.path');
  // Items
  assert(!!jsonFeed.items, 'RSS Items were not mapped');
  const item = jsonFeed.items[0];
  assertEquals(item.id, 'item.guid', 'Item guid was not mapped');
  assertEquals(item.title, 'item.title', 'Item title was not mapped');
  assertEquals(item.external_url, 'item.link', 'Item link was not mapped');
  assertEquals(item.content_html, 'item.link', 'Item link was not mapped');
  assertEquals(item.date_published, new Date(1989, 1, 1), 'Item PubDate was not mapped');

  assert(!!item.author, 'RSS Item author was not mapped');
  assertEquals(item.author.name, 'item.author', 'RSS Item author was not mapped');
  assertEquals(item.author.avatar, undefined, 'Author avatar should be undefined');
  assertEquals(item.author.url, undefined, 'Author url should be undefined');

  assert(!!item.attachments, 'Enclosure was not mapped');
  const attachment = item.attachments[0];
  assertEquals(attachment.url, 'enclosure.url', 'Item Enclosure Url was not mapped');
  assertEquals(attachment.size_in_bytes, 1337, 'Item Enclosure length was not mapped');
  assertEquals(attachment.mime_type, 'enclosure.type', 'Item Enclosure type was not mapped');
  assertEquals(attachment.duration_in_seconds, undefined, 'Attachment duration_in_seconds was not undefined');
  assertEquals(attachment.title, undefined, 'Attachment title was not undefined');
});