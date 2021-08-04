import { assertEquals, assertNotEquals } from "./../../test_deps.ts";
import { toFeed } from "./mapper.ts";
import type { Feed } from "../types/feed.ts";
import { FeedType } from "../types/feed_type.ts";
import { resolveRss1Field } from "../resolvers/rss1_resolver.ts";
import { SlashFieldArray } from "../types/slash.ts";
import { resolveRss2Field } from "../resolvers/rss2_resolver.ts";
import {
  AtomFields,
  DublinCoreFields,
  MediaRssFields,
} from "../types/fields/mod.ts";
import { DublinCoreFieldArray } from "../types/internal/internal_dublin_core.ts";
import type {
  InternalAtom,
  InternalRSS1,
  InternalRSS2,
} from "../types/internal/mod.ts";

const composeAtom = (
  setter: (data: InternalAtom) => void = () => {},
): InternalAtom => {
  const result = {
    id: {
      value: "Atom:Id:Value",
    },
    title: {
      value: "Atom:Title:Value",
      type: "Atom:Title:Type",
    },
    updated: {
      value: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
    },
    updatedRaw: {
      value: "Mon, 22 Jun 2020 20:03:00 GMT",
    },
    icon: {
      value: "Atom:Icon:Value",
    },
    links: [
      {
        type: "Atom:Links:0:Type",
        href: "Atom:Links:0:Href",
        rel: "Atom:Links:0:Rel",
        length: 0,
      },
      {
        type: "Atom:Links:1:Type",
        href: "Atom:Links:1:Href",
        rel: "Atom:Links:1:Rel",
        length: 1,
      },
    ],
    categories: [
      { term: "Atom:Categories:0:Term", label: "Atom:Categories:0:Label" },
      { term: "Atom:Categories:1:Term", label: "Atom:Categories:1:Label" },
    ],
    contributors: [
      {
        name: { value: "Atom:Contributors:0:Name:Value" },
        email: { value: "Atom:Contributors:0:Email:Value" },
        uri: { value: "Atom:Contributors:0:Uri:Value" },
      },
      {
        name: { value: "Atom:Contributors:1:Name:Value" },
        email: { value: "Atom:Contributors:1:Email:Value" },
        uri: { value: "Atom:Contributors:1:Uri:Value" },
      },
    ],
    generator: { value: "Atom:Generator:Value" },
    author: {
      name: { value: "Atom:Author:Name:Value" },
      email: { value: "Atom:Author:Email:Value" },
      uri: { value: "Atom:Author:Uri:Value" },
    },
    logo: {
      value: "Atom:Logo:Value",
      type: "Atom:Logo:Type",
    },
    rights: {
      value: "Atom:Rights:Value",
      type: "Atom:Rights:Type",
    },
    subtitle: {
      value: "Atom:Subtitle:Value",
    },
    entries: [
      {
        id: {
          value: "Atom:Entries:0:Id:value",
        },
        title: {
          type: "Atom:Entries:0:Title:Type",
          value: "Atom:Entries:0:Title:Value",
        },
        summary: {
          type: "Atom:Entries:0:Summary:Type",
          value: "Atom:Entries:0:Summary:Value",
        },
        content: {
          type: "Atom:Entries:0:Content:Type",
          value: "Atom:Entries:0:Content:Value",
          src: "Atom:Entries:0:Src:Value",
        },
        rights: {
          type: "Atom:Entries:0:Rights:Type",
          value: "Atom:Entries:0:Rights:Value",
        },
        updated: {
          value: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        },
        updatedRaw: {
          value: "Mon, 22 Jun 2020 20:03:00 GMT",
        },
        published: {
          value: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        },
        publishedRaw: {
          value: "Mon, 22 Jun 2020 20:03:00 GMT",
        },
        author: {
          name: { value: "Atom:Entries:Author:Name:Value" },
          email: { value: "Atom:Entries:Author:Email:Value" },
          uri: { value: "Atom:Entries:Author:Uri:Value" },
        },
        contributors: [
          {
            name: { value: "Atom:Entries:0:Contributors:0:Name:Value" },
            email: { value: "Atom:Entries:0:Contributors:0:Email:Value" },
            uri: { value: "Atom:Entries:0:Contributors:0:Uri:Value" },
          },
          {
            name: { value: "Atom:Entries:0:Contributors:1:Name:Value" },
            email: { value: "Atom:Entries:0:Contributors:1:Email:Value" },
            uri: { value: "Atom:Entries:0:Contributors:1:Uri:Value" },
          },
        ],
        categories: [
          {
            term: "Atom:Entries:0:Categories:0:Term",
            label: "Atom:Entries:0:Categories:0:Label",
          },
          {
            term: "Atom:Entries:0:Categories:1:Term",
            label: "Atom:Entries:0:Categories:1:Label",
          },
        ],
        source: {
          id: { value: "Atom:Entries:0:Source:Id:Value" },
          title: { value: "Atom:Entries:0:Source:Title:Value" },
          updated: { value: new Date("Mon, 22 Jun 2020 20:03:00 GMT") },
          updatedRaw: { value: "Mon, 22 Jun 2020 20:03:00 GMT" },
        },
        href: "Atom:Entries:0:Href",
        links: [
          {
            type: "Atom:Entries:0:Links:0:Type",
            href: "Atom:Entries:0:Links:0:Href",
            rel: "Atom:Entries:0:Links:0:Rel",
            length: 0,
          },
          {
            type: "test/data",
            href: "Atom:Entries:0:Links:1:Href",
            rel: "enclosure",
            length: 1337,
          },
        ],
      },
    ],
  } as InternalAtom;
  setter && setter(result);
  return result;
};

const composeRss2 = (
  setter: (data: InternalRSS2) => void = () => {},
): InternalRSS2 => {
  const result = {
    version: 1,
    channel: {
      title: {
        value: "RSS2:Channel:Title:Value",
      },
      link: {
        value: "RSS2:Channel:Link:Value",
      },
      description: {
        value: "RSS2:Channel:Description:Value",
      },
      language: {
        value: "RSS2:Channel:Language:Value",
      },
      copyright: {
        value: "RSS2:Channel:Copyright:Value",
      },
      managingEditor: {
        value: "RSS2:Channel:ManagingEditor:Value",
      },
      webMaster: {
        value: "RSS2:Channel:WebMaster:Value",
      },
      pubDate: {
        value: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
      },
      pubDateRaw: {
        value: "Mon, 22 Jun 2020 20:03:00 GMT",
      },
      docs: {
        value: "RSS2:Channel:Docs:Value",
      },
      generator: {
        value: "RSS2:Channel:Generator:Value",
      },
      lastBuildDate: {
        value: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
      },
      lastBuildDateRaw: {
        value: "Mon, 22 Jun 2020 20:03:00 GMT",
      },
      skipDays: {
        day: [
          { value: "RSS2:Channel:SkipDays:Day:0" },
          { value: "RSS2:Channel:SkipDays:Day:1" },
          { value: "RSS2:Channel:SkipDays:Day:2" },
          { value: "RSS2:Channel:SkipDays:Day:3" },
          { value: "RSS2:Channel:SkipDays:Day:4" },
          { value: "RSS2:Channel:SkipDays:Day:5" },
          { value: "RSS2:Channel:SkipDays:Day:6" },
        ],
      },
      skipHours: {
        hour: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
          { value: 12 },
          { value: 13 },
          { value: 14 },
          { value: 15 },
          { value: 16 },
          { value: 17 },
          { value: 18 },
          { value: 19 },
          { value: 20 },
          { value: 21 },
          { value: 22 },
          { value: 23 },
        ],
      },
      ttl: {
        value: 100,
      },
      image: {
        url: {
          value: "RSS2:Channel:Image:Url:Value",
        },
        title: {
          value: "RSS2:Channel:Image:Title:Value",
        },
        link: {
          value: "RSS2:Channel:Image:Link:Value",
        },
        height: {
          value: 69,
        },
        width: {
          value: 34,
        },
      },
      items: [
        {
          title: {
            value: "RSS2:Channel:Item:0:Title:Value",
          },
          description: {
            value: "RSS2:Channel:Item:0:Description:Value",
          },
          author: {
            value: "RSS2:Channel:Item:0:Author:Value",
          },
          link: {
            value: "RSS2:Channel:Item:0:Link:Value",
          },
          guid: {
            value: "RSS2:Channel:Item:0:Guid:Value",
          },
          comments: {
            value: "RSS2:Channel:Item:0:Comments:Value",
          },
          categories: [
            { value: "RSS2:Channel:Item:0:Categories:0:Value" },
            { value: "RSS2:Channel:Item:0:Categories:1:Value" },
          ],
          "media:content": [{
            height: 69,
            width: 32,
            medium: "RSS2:Channel:Item:0:MediaContent:Medium",
            url: "RSS2:Channel:Item:0:MediaContent:Url",
          }],
          "media:credit": {
            value: "RSS2:Channel:Item:0:MediaCredit:Value",
          },
          "media:description": {
            value: "RSS2:Channel:Item:0:MediaDescription:Value",
          },
        },
        {
          title: {
            value: "RSS2:Channel:Item:1:Title:Value",
          },
          description: {
            value: "RSS2:Channel:Item:1:Description:Value",
          },
          link: {
            value: "RSS2:Channel:Item:1:Link:Value",
          },
          guid: {
            value: "RSS2:Channel:Item:1:Guid:Value",
          },
          comments: {
            value: "RSS2:Channel:Item:1:Comments:Value",
          },
          categories: [
            { value: "RSS2:Channel:Item:1:Categories:0:Value" },
            { value: "RSS2:Channel:Item:1:Categories:1:Value" },
          ],
        },
        {
          title: {
            value: "RSS2:Channel:Item:2:Title:Value",
          },
          description: {
            value: "RSS2:Channel:Item:2:Description:Value",
          },
          link: {
            value: "RSS2:Channel:Item:2:Link:Value",
          },
          guid: {
            value: "RSS2:Channel:Item:2:Guid:Value",
          },
          comments: {
            value: "RSS2:Channel:Item:2:Comments:Value",
          },
          categories: [
            { value: "RSS2:Channel:Item:2:Categories:0:Value" },
            { value: "RSS2:Channel:Item:2:Categories:1:Value" },
          ],
        },
      ],
    },
  } as InternalRSS2;

  DublinCoreFieldArray.forEach(
    ((dcField) => {
      const fieldName = formatNamespaceFieldName(dcField);
      const { isArray, isDate, isInt, isFloat } = resolveRss2Field(
        dcField,
      );

      let channelValue: any = { value: `RSS2:Channel:${fieldName}:Value` };
      let itemValue: any = { value: `RSS2:Channel:Item:0:${fieldName}:Value` };

      if (isDate) {
        channelValue = { value: new Date("Mon, 22 Jun 2020 20:03:00 GMT") };
        itemValue = { value: new Date("Mon, 22 Jun 2020 20:03:00 GMT") };
      }

      if (isInt) {
        channelValue = { value: 1337 };
        itemValue = 1337;
      }

      if (isFloat) {
        channelValue = { value: 1337.1337 };
        itemValue = 1337.1337;
      }

      if (isArray) {
        channelValue = [{ value: `RSS2:Channel:${fieldName}:0:Value` }, {
          value: `RSS2:Channel:${fieldName}:1:Value`,
        }];
        itemValue = [{ value: `RSS2:Channel:${fieldName}:0:Value` }, {
          value: `RSS2:Channel:${fieldName}:1:Value`,
        }];
      }

      (result.channel as any)[dcField] = channelValue;
      (result.channel.items[0] as any)[dcField] = itemValue;
    }),
  );

  setter && setter(result);
  return result;
};

const composeRss1 = (
  setter: (data: InternalRSS1) => void = () => {},
): InternalRSS1 => {
  const result = {
    channel: {
      title: {
        value: "RSS1:Channel:Title:Value",
      },
      link: {
        value: "RSS1:Channel:Link:Value",
      },
      description: {
        value: "RSS1:Channel:Description:Value",
      },
      about: {
        value: "RSS1:Channel:About:Value",
      },
    },
    image: {
      about: "RSS1:Image:About",
      resource: "RSS1:Image:Resource",
      title: {
        value: "RSS1:Image:Title:Value",
      },
      link: {
        value: "RSS1:Image:Link:Value",
      },
      url: {
        value: "RSS1:Image:Url:Value",
      },
    },
    item: [
      {
        title: {
          value: "RSS1:Item:0:Title:Value",
        },
        link: {
          value: "RSS1:Item:0:Link:Value",
        },
        description: {
          value: "RSS1:Item:0:Description:Value",
        },
      },
    ],
  } as InternalRSS1;

  DublinCoreFieldArray.forEach(
    ((dcField) => {
      const fieldName = formatNamespaceFieldName(dcField);
      const { isArray, isInt, isFloat, isDate } = resolveRss1Field(
        dcField,
      );

      let channelValue: any;
      let itemValue: any;

      if (isArray) {
        channelValue = [{ value: `RSS1:Channel:${fieldName}:0:Value` }, {
          value: `RSS1:Channel:${fieldName}:1:Value`,
        }];
        itemValue = [{ value: `RSS1:Channel:${fieldName}:0:Value` }, {
          value: `RSS1:Channel:${fieldName}:1:Value`,
        }];
      } else if (isDate) {
        channelValue = { value: new Date("Mon, 22 Jun 2020 20:03:00 GMT") };
        itemValue = { value: new Date("Mon, 22 Jun 2020 20:03:00 GMT") };
      } else if (isInt) {
        channelValue = { value: 1337 };
        itemValue = { value: 1337 };
      } else if (isFloat) {
        channelValue = { value: 1337.1337 };
        itemValue = { value: 1337.1337 };
      }

      (result.channel as any)[dcField] = channelValue ||
        { value: `RSS1:Channel:${fieldName}:Value` };
      (result.item[0] as any)[dcField] = itemValue ||
        { value: `RSS1:Item:0:${fieldName}:Value` };
    }),
  );

  SlashFieldArray.forEach((slashField) => {
    const fieldName = formatNamespaceFieldName(slashField);
    const { isInt, isFloat, isDate } = resolveRss1Field(
      slashField,
    );

    let value: string | number | Date = `RSS1:Item:0:${fieldName}:Value`;

    if (isDate) {
      value = new Date("Mon, 22 Jun 2020 20:03:00 GMT");
    } else if (isInt) {
      value = 1337;
    } else if (isFloat) {
      value = 1337.1337;
    }

    (result.item[0] as any)[slashField] = { value };
  });

  setter && setter(result);
  return result;
};

const formatNamespaceFieldName = (field: string) => {
  const nameSplit = field.split(":");
  return nameSplit[0].toUpperCase() + nameSplit[1].charAt(0).toUpperCase() +
    nameSplit[1].slice(1);
};

const testTextField = (
  fieldName: string,
  target: any,
  type: string | undefined,
  value: string,
) => {
  return [
    {
      name: fieldName,
      getValue: (src: Feed) => target(src),
      assert: [{ fn: assertNotEquals, expect: undefined }, {
        fn: assertNotEquals,
        expect: null,
      }],
    },
    {
      name: `${fieldName}:Type`,
      getValue: (src: Feed) => target(src).type,
      assert: [{ fn: assertEquals, expect: type }],
    },
    {
      name: `${fieldName}:Value`,
      getValue: (src: Feed) => target(src).value,
      assert: [{ fn: assertEquals, expect: value }],
    },
  ];
};

const testArrayLength = (
  fieldName: string,
  target: any,
  expectedLength: number,
) => {
  return [
    {
      name: fieldName,
      getValue: (src: Feed) => target(src),
      assert: [{ fn: assertNotEquals, expect: undefined }, {
        fn: assertNotEquals,
        expect: null,
      }],
    },
    {
      name: `${fieldName}:Length`,
      getValue: (src: Feed) => target(src)?.length,
      assert: [{ fn: assertEquals, expect: expectedLength }],
    },
  ];
};

[
  {
    name: "RSS1",
    source: toFeed(
      FeedType.Rss1,
      composeRss1((data) => {
        data.channel[DublinCoreFields.Title] = undefined;
        data.channel[DublinCoreFields.Description] = undefined;
        data.channel[DublinCoreFields.URI] = undefined;
        data.channel[DublinCoreFields.Title] = undefined;
        data.item[0][DublinCoreFields.Title] = undefined;
        data.item[0][DublinCoreFields.Description] = undefined;
        data.item[0][DublinCoreFields.URI] = undefined;
      }),
    ) as Feed,
    tests: [
      {
        name: "Root",
        getValue: (src: Feed) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      ...testTextField(
        "Title",
        (src: Feed) => src.title,
        undefined,
        "RSS1:Channel:Title:Value",
      ),
      {
        name: "Description",
        getValue: (src: Feed) => src.description,
        assert: [{
          fn: assertEquals,
          expect: "RSS1:Channel:Description:Value",
        }],
      },
      {
        name: "Language",
        getValue: (src: Feed) => src.language,
        assert: [{ fn: assertEquals, expect: "RSS1:Channel:DCLanguage:Value" }],
      },
      ...testArrayLength("Link", (src: Feed) => src.links, 1),
      {
        name: "Link:Value:0",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "RSS1:Channel:Link:Value" }],
      },
      {
        name: "Copyright",
        getValue: (src: Feed) => src.copyright,
        assert: [{ fn: assertEquals, expect: "RSS1:Channel:DCRights:Value" }],
      },
      {
        name: "PubDate",
        getValue: (src: Feed) => src.published,
        assert: [{
          fn: assertEquals,
          expect: new Date("2020-06-22T20:03:00.000Z"),
        }],
      },
      {
        name: "PubDateRaw",
        getValue: (src: Feed) => src.publishedRaw,
        assert: [{
          fn: assertEquals,
          expect: "RSS1:Channel:DCDateSubmittedRaw:Value",
        }],
      },
      {
        name: "Docs",
        getValue: (src: Feed) => src.docs,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Generator",
        getValue: (src: Feed) => src.generator,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "LastBuildDate",
        getValue: (src: Feed) => src.created,
        assert: [{
          fn: assertEquals,
          expect: new Date("2020-06-22T20:03:00.000Z"),
        }],
      },
      {
        name: "DcDate",
        getValue: (src: Feed) => src.updateDate,
        assert: [{
          fn: assertEquals,
          expect: new Date("2020-06-22T20:03:00.000Z"),
        }],
      },
      {
        name: "DcDateRaw",
        getValue: (src: Feed) => src.updateDateRaw,
        assert: [{
          fn: assertEquals,
          expect: "RSS1:Channel:DCDateRaw:Value",
        }],
      },
      {
        name: "LastBuildDateRaw",
        getValue: (src: Feed) => src.createdRaw,
        assert: [{
          fn: assertEquals,
          expect: "RSS1:Channel:DCCreatedRaw:Value",
        }],
      },
      {
        name: "Ttl",
        getValue: (src: Feed) => src.ttl,
        assert: [{ fn: assertEquals, expect: undefined }],
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
        assert: [{ fn: assertEquals, expect: "RSS1:Image:Url:Value" }],
      },
      {
        name: "Image:Title",
        getValue: (src: Feed) => src.image?.title,
        assert: [{ fn: assertEquals, expect: "RSS1:Image:Title:Value" }],
      },
      {
        name: "Image:Link",
        getValue: (src: Feed) => src.image?.link,
        assert: [{ fn: assertEquals, expect: "RSS1:Image:Link:Value" }],
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
      ...testArrayLength("Items", (src: Feed) => src.entries, 1),
      ...testTextField(
        "Items:0:Title",
        (src: Feed) => src.entries[0].title,
        undefined,
        "RSS1:Item:0:Title:Value",
      ),
      ...testTextField(
        "Items:0:Description",
        (src: Feed) => src.entries[0].description,
        undefined,
        "RSS1:Item:0:Description:Value",
      ),
      {
        name: "Items:0:Link:0",
        getValue: (src: Feed) => src.entries[0].links[0].href,
        assert: [{
          fn: assertEquals,
          expect: "RSS1:Item:0:Link:Value",
        }],
      },
      {
        name: "Items:0:Id",
        getValue: (src: Feed) => src.entries[0].id,
        assert: [{ fn: assertEquals, expect: "RSS1:Item:0:Link:Value" }],
      },
      {
        name: "Items:0:Comments",
        getValue: (src: Feed) => src.entries[0].comments,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:Published",
        getValue: (src: Feed) => src.entries[0].published,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "Items:0:PublishedRaw",
        getValue: (src: Feed) => src.entries[0].publishedRaw,
        assert: [{
          fn: assertEquals,
          expect: "RSS1:Item:0:DCDateSubmittedRaw:Value",
        }],
      },
      {
        name: "Items:0:MediaCredit",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Credit],
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaDescription",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Description],
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Content],
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Height",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].height,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Width",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].width,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Medium",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].medium,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Url",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].url,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      ...SlashFieldArray.map((slashField) => {
        const fieldName = formatNamespaceFieldName(slashField);
        const { isInt, isFloat } = resolveRss1Field(slashField);

        let expectValue: string | number | Date =
          `RSS1:Item:0:${fieldName}:Value`;
        if (isInt) {
          expectValue = 1337;
        } else if (isFloat) {
          expectValue = 1337.1337;
        }

        return {
          name: `Items:0:${fieldName}`,
          getValue: (src: Feed) => src.entries[0][slashField],
          assert: [{ fn: assertEquals, expect: expectValue }],
        };
      }),
    ],
  },
  {
    name: "RSS2",
    source: toFeed(
      FeedType.Rss2,
      composeRss2((data) => {
        data.channel[DublinCoreFields.Creator] = undefined;
        data.channel[DublinCoreFields.Description] = undefined;
        data.channel[DublinCoreFields.URI] = undefined;
        data.channel[DublinCoreFields.Title] = undefined;
        data.channel[DublinCoreFields.Language] = undefined;
        data.channel[DublinCoreFields.CreatedRaw] = undefined;
        data.channel[DublinCoreFields.DateSubmittedRaw] = undefined;
        data.channel.items[0][DublinCoreFields.Title] = undefined;
        data.channel.items[0][DublinCoreFields.Description] = undefined;
        data.channel.items[0][DublinCoreFields.URI] = undefined;
      }),
    ) as Feed,
    tests: [
      {
        name: "Root",
        getValue: (src: Feed) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      ...testTextField(
        "Title",
        (src: Feed) => src.title,
        undefined,
        "RSS2:Channel:Title:Value",
      ),
      {
        name: "Description",
        getValue: (src: Feed) => src.description,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Description:Value",
        }],
      },
      {
        name: "Language",
        getValue: (src: Feed) => src.language,
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Language:Value" }],
      },
      ...testArrayLength("Link", (src: Feed) => src.links, 1),
      {
        name: "Link:Value:0",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Link:Value" }],
      },
      {
        name: "Copyright",
        getValue: (src: Feed) => src.copyright,
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Copyright:Value" }],
      },
      {
        name: "WebMaster (Author, For Author mapping)",
        getValue: (src: Feed) => src.author,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "WebMaster (Author:Email For Author mapping)",
        getValue: (src: Feed) => src.author?.email,
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:WebMaster:Value" }],
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
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:DCDateRaw:Value" }],
      },
      {
        name: "Docs",
        getValue: (src: Feed) => src.docs,
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Docs:Value" }],
      },
      {
        name: "Generator",
        getValue: (src: Feed) => src.generator,
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Generator:Value" }],
      },
      {
        name: "LastBuildDate",
        getValue: (src: Feed) => src.created,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "LastBuildDateRaw",
        getValue: (src: Feed) => src.createdRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      ...testArrayLength("SkipDays", (src: Feed) => src.skipDays, 7),
      ...testArrayLength("SkipHours", (src: Feed) => src.skipHours, 24),
      {
        name: "SkipDays:0",
        getValue: (src: Feed) => src.skipDays?.[0],
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:SkipDays:Day:0" }],
      },
      {
        name: "SkipDays:6",
        getValue: (src: Feed) => src.skipDays?.[6],
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:SkipDays:Day:6" }],
      },
      {
        name: "SkipHours:0",
        getValue: (src: Feed) => src.skipDays?.[0],
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:SkipDays:Day:0" }],
      },
      {
        name: "SkipHours:23",
        getValue: (src: Feed) => src.skipHours?.[23],
        assert: [{ fn: assertEquals, expect: 23 }],
      },
      {
        name: "Ttl",
        getValue: (src: Feed) => src.ttl,
        assert: [{ fn: assertEquals, expect: 100 }],
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
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Image:Url:Value" }],
      },
      {
        name: "Image:Title",
        getValue: (src: Feed) => src.image?.title,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Image:Title:Value",
        }],
      },
      {
        name: "Image:Link",
        getValue: (src: Feed) => src.image?.link,
        assert: [{ fn: assertEquals, expect: "RSS2:Channel:Image:Link:Value" }],
      },
      {
        name: "Image:Height",
        getValue: (src: Feed) => src.image?.height,
        assert: [{ fn: assertEquals, expect: 69 }],
      },
      {
        name: "Image:Width",
        getValue: (src: Feed) => src.image?.width,
        assert: [{ fn: assertEquals, expect: 34 }],
      },
      ...testArrayLength("Items", (src: Feed) => src.entries, 3),
      ...testTextField(
        "Items:0:Title",
        (src: Feed) => src.entries[0].title,
        undefined,
        "RSS2:Channel:Item:0:Title:Value",
      ),
      ...testTextField(
        "Items:0:Description",
        (src: Feed) => src.entries[0].description,
        undefined,
        "RSS2:Channel:Item:0:Description:Value",
      ),
      {
        name: "Items:0:Author:Name",
        getValue: (src: Feed) => src.entries[0].author?.name,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:Author:Value",
        }],
      },
      {
        name: "Items:0:Link:0",
        getValue: (src: Feed) => src.entries[0].links[0].href,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:Link:Value",
        }],
      },
      {
        name: "Items:0:Guid",
        getValue: (src: Feed) => src.entries[0].id,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:Guid:Value",
        }],
      },
      {
        name: "Items:0:Comments",
        getValue: (src: Feed) => src.entries[0].comments,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:Comments:Value",
        }],
      },
      ...testArrayLength(
        "Items:0:Categories",
        (src: Feed) => src.entries[0].categories,
        2,
      ),
      {
        name: "Items:0:MediaCredit",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Credit]?.value,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:MediaCredit:Value",
        }],
      },
      {
        name: "Items:0:MediaDescription",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Description]?.value,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:MediaDescription:Value",
        }],
      },
      {
        name: "Items:0:MediaContent",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Content],
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      {
        name: "Items:0:MediaContent:Height",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].height,
        assert: [{ fn: assertEquals, expect: 69 }],
      },
      {
        name: "Items:0:MediaContent:Width",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].width,
        assert: [{ fn: assertEquals, expect: 32 }],
      },
      {
        name: "Items:0:MediaContent:Medium",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].medium,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:MediaContent:Medium",
        }],
      },
      {
        name: "Items:0:MediaContent:Url",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].url,
        assert: [{
          fn: assertEquals,
          expect: "RSS2:Channel:Item:0:MediaContent:Url",
        }],
      },
      ...DublinCoreFieldArray
        .filter((x) =>
          ![
            DublinCoreFields.Description,
            DublinCoreFields.URI,
            DublinCoreFields.Title,
            DublinCoreFields.Language,
            DublinCoreFields.CreatedRaw,
            DublinCoreFields.DateSubmittedRaw,
            DublinCoreFields.Title,
            DublinCoreFields.Description,
            DublinCoreFields.URI,
            DublinCoreFields.Creator,
            DublinCoreFields.Valid,
          ].some((ignoreField) => x === ignoreField)
        )
        .flatMap((dcField) => {
          const fieldName = formatNamespaceFieldName(dcField);
          const { isArray, isInt, isFloat, isDate } = resolveRss2Field(
            dcField,
          );

          let expectValue;

          if (isArray) {
            expectValue = [
              `RSS2:Channel:${fieldName}:0:Value`,
              `RSS2:Channel:${fieldName}:1:Value`,
            ];
          } else if (isInt) {
            expectValue = 1337;
          } else if (isDate) {
            expectValue = new Date("2020-06-22T20:03:00.000Z");
          } else if (isFloat) {
            expectValue = 1337.1337;
          }

          return [
            {
              name: `Items:0:${fieldName}`,
              getValue: (src: Feed) => (src as any)[dcField],
              assert: [{
                fn: assertEquals,
                expect: (expectValue || `RSS2:Channel:${fieldName}:Value`),
              }],
            },
            {
              name: `Items:0:${fieldName}`,
              getValue: (src: Feed) => (src.entries[0] as any)[dcField],
              assert: [{
                fn: assertEquals,
                expect:
                  (expectValue || `RSS2:Channel:Item:0:${fieldName}:Value`),
              }],
            },
          ];
        }),
    ],
  },
  {
    name: "RSS2:Missing Objects:",
    source: toFeed(
      FeedType.Rss2,
      composeRss2((data) => {
        data.channel[DublinCoreFields.Creator] = undefined;
        data.channel[DublinCoreFields.Description] = undefined;
        data.channel[DublinCoreFields.URI] = undefined;
        data.channel[DublinCoreFields.Title] = undefined;
        data.channel[DublinCoreFields.Language] = undefined;
        data.channel[DublinCoreFields.CreatedRaw] = undefined;
        data.channel[DublinCoreFields.DateSubmittedRaw] = undefined;
        data.channel.items[0][DublinCoreFields.Title] = undefined;
        data.channel.items[0][DublinCoreFields.Description] = undefined;
        data.channel.items[0][DublinCoreFields.URI] = undefined;
        data.channel.cloud = {};
        data.channel.category = [{}];
        data.channel.skipDays = {};
        data.channel.skipHours = {};
        data.channel.items[0].enclosure = [{}];
        data.channel.items[0].categories = [];
        data.channel.title = undefined as any;
        data.channel.description = undefined as any;
      }),
    ) as Feed,
    tests: [
      {
        name: "Items",
        getValue: (src: Feed) => src.entries,
        assert: [{ fn: assertNotEquals, expect: undefined }],
      },
    ],
  },
  {
    name: "Atom",
    source: toFeed(FeedType.Atom, composeAtom()) as Feed,
    tests: [
      {
        name: "Root",
        getValue: (src: Feed) => src,
        assert: [{ fn: assertNotEquals, expect: undefined }, {
          fn: assertNotEquals,
          expect: null,
        }],
      },
      ...testTextField(
        "Title",
        (src: Feed) => src.title,
        "Atom:Title:Type",
        "Atom:Title:Value",
      ),
      {
        name: "Description",
        getValue: (src: Feed) => src.description,
        assert: [{ fn: assertEquals, expect: "Atom:Subtitle:Value" }],
      },
      {
        name: "Language",
        getValue: (src: Feed) => src.language,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      ...testArrayLength("Link", (src: Feed) => src.links, 2),
      {
        name: "Link:Value:0",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "Atom:Links:0:Href" }],
      },
      {
        name: "Link:Value:0",
        getValue: (src: Feed) => src.links[0],
        assert: [{ fn: assertEquals, expect: "Atom:Links:0:Href" }],
      },
      {
        name: "Copyright",
        getValue: (src: Feed) => src.copyright,
        assert: [{ fn: assertEquals, expect: undefined }],
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
        name: "Docs",
        getValue: (src: Feed) => src.docs,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Generator",
        getValue: (src: Feed) => src.generator,
        assert: [{ fn: assertEquals, expect: "Atom:Generator:Value" }],
      },
      {
        name: "LastBuildDate",
        getValue: (src: Feed) => src.created,
        assert: [{
          fn: assertEquals,
          expect: new Date("Mon, 22 Jun 2020 20:03:00 GMT"),
        }],
      },
      {
        name: "LastBuildDateRaw",
        getValue: (src: Feed) => src.createdRaw,
        assert: [{ fn: assertEquals, expect: "Mon, 22 Jun 2020 20:03:00 GMT" }],
      },
      {
        name: "Ttl",
        getValue: (src: Feed) => src.ttl,
        assert: [{ fn: assertEquals, expect: undefined }],
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
        assert: [{ fn: assertEquals, expect: "Atom:Logo:Value" }],
      },
      {
        name: "Image:Title",
        getValue: (src: Feed) => src.image?.title,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Image:Link",
        getValue: (src: Feed) => src.image?.link,
        assert: [{ fn: assertEquals, expect: "Atom:Logo:Value" }],
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
      ...testArrayLength("Items", (src: Feed) => src.entries, 1),
      ...testTextField(
        "Items:0:Title",
        (src: Feed) => src.entries[0].title,
        "Atom:Entries:0:Title:Type",
        "Atom:Entries:0:Title:Value",
      ),
      ...testTextField(
        "Items:0:Description",
        (src: Feed) => src.entries[0].description,
        "Atom:Entries:0:Summary:Type",
        "Atom:Entries:0:Summary:Value",
      ),
      {
        name: "Items:0:Id",
        getValue: (src: Feed) => src.entries[0].id,
        assert: [{ fn: assertEquals, expect: "Atom:Entries:0:Id:value" }],
      },
      {
        name: "Items:0:Comments",
        getValue: (src: Feed) => src.entries[0].comments,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      ...testArrayLength(
        "Items:0:Categories",
        (src: Feed) => src.entries[0].categories,
        2,
      ),
      {
        name: "Items:0:MediaCredit",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Credit],
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaDescription",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Description],
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent",
        getValue: (src: Feed) => src.entries[0][MediaRssFields.Content],
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Height",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].height,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Width",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].width,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Medium",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].medium,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
      {
        name: "Items:0:MediaContent:Url",
        getValue: (src: Feed) =>
          src.entries[0][MediaRssFields.Content]?.[0].url,
        assert: [{ fn: assertEquals, expect: undefined }],
      },
    ],
  },
  {
    name: "AtomFeedburner",
    source: toFeed(
      FeedType.Atom,
      composeAtom((data) => {
        data.entries[0][AtomFields.FeedburnerOrigLink] = {
          value: "Atom:Entries:0:Feedburner:Origlink",
        };
      }),
    ) as Feed,
    tests: [
      {
        name: "Items:0:Id",
        getValue: (src: Feed) => src.entries[0].id,
        assert: [{
          fn: assertEquals,
          expect: "Atom:Entries:0:Feedburner:Origlink",
        }],
      },
      {
        name: "Items:0:Link",
        getValue: (src: Feed) => src.entries[0].links[0].href,
        assert: [{
          fn: assertEquals,
          expect: "Atom:Entries:0:Feedburner:Origlink",
        }],
      },
    ],
  },
].forEach((workspace) => {
  workspace.tests.forEach((test) => {
    Deno.test(`toFeed:${workspace.name}:${test.name}`, () => {
      const target = test.getValue(workspace.source);
      test.assert.forEach((x) => x.fn(target, x.expect));
    });
  });
});
