import type {
  Atom,
  JsonFeed,
  JsonFeedAuthor,
  JsonFeedItem,
  RSS1,
  RSS2,
  Rss2Item,
} from "./../types/mod.ts";

import type {
  InternalAtom,
  InternalRSS1,
  InternalRSS2,
} from "../types/internal/mod.ts";

import { FeedType } from "./../types/mod.ts";

import { copyValueFields, isValidURL } from "./../util.ts";
import { SlashFieldArray } from "./../types/slash.ts";
import { copyMedia } from "./media_mapper.ts";
import { DublinCoreFieldArray } from "../types/internal/internal_dublin_core.ts";
import { AtomFields, DublinCoreFields } from "../types/fields/mod.ts";

export const toLegacyRss1 = (rss: InternalRSS1): RSS1 => {
  const {
    title,
    description,
    link,
    about,
    ...channel
  } = rss.channel;

  const result = {
    channel,
  } as RSS1;

  result.channel.title = title?.value as string;
  result.channel.description = description?.value as string;
  result.channel.link = link?.value as string;
  result.channel.about = about?.value as string;
  copyValueFields(DublinCoreFieldArray, result.channel, result.channel);

  if (rss.image) {
    result.image = {
      title: rss.image.title?.value as string,
      link: rss.image.link?.value as string,
      about: rss.image.about,
      url: rss.image.url?.value as string,
      resource: rss.image.resource,
    };
  }

  result.item = rss.item?.map((item) => {
    const {
      link,
      title,
      description,
      ...itemRest
    } = item;

    const itemResult = itemRest as any;
    itemResult.title = title?.value as string;
    itemResult.description = description?.value as string;
    itemResult.link = link?.value as string;
    copyValueFields(DublinCoreFieldArray, item, itemResult);
    copyValueFields(SlashFieldArray, item, itemResult);
    return itemResult;
  });

  if (rss.textInput) {
    result.textInput = {
      title: rss.textInput.title?.value as string,
      about: rss.textInput.about,
      description: rss.textInput.description?.value as string,
      link: rss.textInput.link?.value as string,
      name: rss.textInput.name?.value as string,
    };
  }

  return result;
};

export const toLegacyRss2 = (rss: InternalRSS2): RSS2 => {
  const result = {} as RSS2;

  if (rss.channel) {
    const {
      items,
      title,
      description,
      generator,
      pubDate,
      pubDateRaw,
      lastBuildDate,
      lastBuildDateRaw,
      docs,
      webMaster,
      language,
      copyright,
      ttl,
      skipDays,
      skipHours,
      link,
      image,
      ...rest
    } = rss.channel;

    result.channel = rest as any;
    Object.assign(result.channel, {
      title: title?.value,
      description: description?.value,
      language: language?.value,
      link: rss.channel.link?.value,
      ttl: rss.channel.ttl?.value,
      docs: rss.channel.docs?.value,
      copyright: rss.channel.copyright?.value,
      managingEditor: rss.channel.managingEditor?.value,
      lastBuildDate: rss.channel.lastBuildDate?.value,
      lastBuildDateRaw: rss.channel.lastBuildDateRaw?.value,
      webMaster: rss.channel.webMaster?.value,
      pubDate: rss.channel.pubDate?.value,
      pubDateRaw: rss.channel.pubDateRaw?.value,
      generator: rss.channel.generator?.value,
      category: rss.channel.category?.map((x) => x.value),
      items: rss.channel.items?.map((item) => {
        const {
          guid,
          pubDate,
          pubDateRaw,
          title,
          description,
          link,
          author,
          enclosure,
          comments,
          categories,
          ...itemRest
        } = item;

        const itemResult = Object.assign(itemRest as Rss2Item, {
          guid: guid?.value,
          pubDate: pubDate?.value,
          pubDateRaw: pubDateRaw?.value,
          title: title?.value,
          description: description?.value,
          link: link?.value,
          author: author?.value ||
            ((item[DublinCoreFields.Creator]?.length || 0) > 0
              ? item[DublinCoreFields.Creator]?.[0].value
              : undefined),
          enclosure: enclosure?.[0]
            ? {
              url: enclosure?.[0].url,
              type: enclosure?.[0].type,
              length: enclosure?.[0].length,
            }
            : undefined,
          comments: comments?.value,
          categories: categories?.map((x) => x.value as string),
        });
        copyValueFields(DublinCoreFieldArray, item, itemResult);
        copyMedia(item, itemResult);
        return itemResult;
      }),
    });

    if (image) {
      result.channel.image = {
        url: image.url?.value,
        title: image.title?.value,
        link: image.link?.value,
        width: image.width?.value,
        height: image.height?.value,
      };
    }

    if (skipHours && skipHours.hour) {
      result.channel.skipHours = {
        hour: skipHours.hour?.map((x) => x?.value) as number[],
      };
    }

    if (skipDays && skipDays.day) {
      result.channel.skipDays = {
        day: skipDays.day?.map((x) => x.value) as string[],
      };
    }
  }

  return result;
};

export const toLegacyAtom = (atom: InternalAtom): Atom => {
  const {
    id,
    generator,
    title,
    subtitle,
    updated,
    updatedRaw,
    icon,
    links,
    logo,
    categories,
    author,
    entries,
    ...rest
  } = atom;

  const result = Object.assign(
    rest as Atom,
    {
      title: {
        type: atom.title?.type,
        value: atom.title?.value,
      },
      id: id?.value,
      icon: icon?.value,
      logo: logo?.value,
      updated: updated?.value,
      updatedRaw: updatedRaw?.value,
      links: links?.map((x) => ({
        href: x.href,
        rel: x.rel,
        type: x.type,
        length: x.length,
      })),
      categories: categories?.map((x) => ({
        term: x.term,
        label: x.label,
      })),
      subtitle: subtitle?.value,
      author: {
        name: author?.name?.value,
        email: author?.email?.value,
        uri: author?.uri?.value,
      },
      entries: entries?.map((entry) => {
        const {
          links,
          href,
          id,
          title,
          summary,
          published,
          publishedRaw,
          updated,
          updatedRaw,
          source,
          author,
          content,
          contributors,
          categories,
          rights,
          ...entryRest
        } = entry;

        const entryResult = Object.assign(entryRest, {
          id: id?.value,
          title: {
            type: title?.type,
            value: title?.value,
          },
          updated: updated?.value,
          updatedRaw: updatedRaw?.value,
          published: published?.value,
          publishedRaw: publishedRaw?.value,
          href: href,
          content: {
            type: content?.type,
            src: content?.src,
            value: content?.value,
          },
          links: links?.map((x) => ({
            type: x.type,
            href: x.href,
            rel: x.rel,
            length: x.length,
          })),
          author: {
            name: author?.name?.value,
            email: author?.email?.value,
            uri: author?.uri?.value,
          },
          contributors: contributors?.map((contributor) => ({
            name: contributor?.name?.value,
            email: contributor?.email?.value,
            uri: contributor?.uri?.value,
          })),
          summary: {
            type: summary?.type,
            value: summary?.value,
          },
          rights: {
            type: rights?.type,
            value: rights?.value,
          },
          categories: categories?.map((category) => ({
            label: category.label,
            term: category.term,
          })),
          source: {
            id: source?.id?.value,
            title: source?.title?.value,
            updated: source?.updated?.value,
            updatedRaw: source?.updatedRaw?.value,
          },
        });

        return entryResult;
      }),
    },
  );
  return result;
};

export const toJsonFeed = (
  feedType: FeedType,
  feed: Atom | RSS2 | RSS1,
): JsonFeed | null => {
  if (!feed) {
    return null;
  }

  let result: JsonFeed | null = null;
  switch (feedType) {
    case FeedType.Atom:
      result = mapAtomToJsonFeed(feed as Atom);
      break;
    case FeedType.Rss2:
      result = mapRss2ToJsonFeed(feed as RSS2);
      break;
    case FeedType.Rss1:
      result = mapRss1ToJsonFeed(feed as RSS1);
      break;
  }

  return result;
};

const mapRss2ToJsonFeed = (rss: RSS2): JsonFeed => {
  const items = rss.channel?.items?.map((rssItem) => {
    let authors, author, attachments;

    if (rssItem.author) {
      author = {
        name: rssItem.author,
      };
      authors = [author];
    } else if (rssItem[DublinCoreFields.Creator]) {
      author = {
        name: rssItem[DublinCoreFields.Creator]?.[0],
      };
      authors = rssItem[DublinCoreFields.Creator]?.map((creator) => ({
        name: creator,
      }));
    }

    if (rssItem.enclosure) {
      attachments = [{
        url: rssItem.enclosure.url,
        mime_type: rssItem.enclosure.type,
        size_in_bytes: rssItem.enclosure.length,
      }];
    }

    return {
      id: rssItem.guid,
      summary: rssItem.description,
      title: rssItem.title,
      external_url: rssItem.link,
      content_html: rssItem.link,
      author,
      authors,
      attachments,
      url: rssItem.link,
      date_published: rssItem.pubDate,
      date_publishedRaw: rssItem.pubDateRaw,
      date_modified: rssItem.pubDate,
      date_modifiedRaw: rssItem.pubDateRaw,
    } as JsonFeedItem;
  }) || [];

  const channel = rss.channel;
  let author, hubs;

  if (channel && (channel.managingEditor || channel.webMaster)) {
    author = {
      url: channel.managingEditor || channel.webMaster,
    };
  }

  if (channel?.cloud) {
    hubs = [{
      type: channel.cloud.protocol,
      url: `${channel.cloud.domain}${
        channel.cloud.port ? ":" + channel.cloud.port : ""
      }${channel.cloud.path}`,
    }];
  }

  return {
    title: channel?.title,
    description: channel?.description,
    icon: channel?.image?.url,
    home_page_url: channel?.link,
    items,
    author,
    hubs,
  } as JsonFeed;
};

const mapRss1ToJsonFeed = (rss: RSS1): JsonFeed => {
  const result = {} as JsonFeed;

  if (rss?.channel) {
    result.title = rss.channel.title;
    result.description = rss.channel.description;
    result.feed_url = rss.channel.link;

    const authorNames = rss.channel[DublinCoreFields.Creator];
    if (authorNames && authorNames.length > 0) {
      result.author = {
        name: authorNames[0],
      };
    }

    result.items = rss.item.map((item) => {
      let author, authors;
      const authorNames = item[DublinCoreFields.Creator];
      if (authorNames && authorNames.length > 0) {
        author = {
          name: authorNames[0],
        };
        authors = authorNames.map((x) => ({ name: x[0] }));
      }

      const itemResult = {
        id: item.link || item[DublinCoreFields.URI],
        title: item.title,
        summary: item.description,
        url: item.link || item[DublinCoreFields.URI],
        author,
        authors,
        date_modified: item[DublinCoreFields.DateSubmitted] ||
          item[DublinCoreFields.Date],
        date_modifiedRaw: item[DublinCoreFields.DateSubmittedRaw] ||
          item[DublinCoreFields.DateRaw],
        date_published: item[DublinCoreFields.DateSubmitted] ||
          item[DublinCoreFields.Date],
        date_publishedRaw: item[DublinCoreFields.DateSubmittedRaw] ||
          item[DublinCoreFields.DateRaw],
      } as JsonFeedItem;
      return itemResult;
    });
  }

  if (rss?.image) {
    result.icon = rss.image.url;
  }

  return result;
};

const mapAtomToJsonFeed = (atom: Atom): JsonFeed => {
  const feed = {
    icon: atom.icon,
    title: atom.title?.value ?? atom.title,
    author: atom.author
      ? {
        name: atom.author.name,
        url: atom.author.uri,
      } as JsonFeedAuthor
      : undefined,
    items: atom.entries?.map((entry) => {
      let url: string | undefined;
      if (entry[AtomFields.FeedburnerOrigLink]) {
        url = entry[AtomFields.FeedburnerOrigLink];
      } else if (entry.href) {
        url = entry.href;
      } else if (isValidURL(entry.id)) {
        url = entry.id;
      }

      const item: JsonFeedItem = {
        id: entry.id,
        title: entry.title?.value ?? entry.title,
        date_published: entry.published,
        date_publishedRaw: entry.publishedRaw,
        date_modified: entry.updated,
        date_modifiedRaw: entry.updatedRaw,
        summary: entry.summary?.value,
        tags: entry.categories?.map((x) => x.term),
        author: {
          name: entry.author?.name,
          url: entry.author?.uri,
        },
        url,
        attachments: entry.links?.filter((link) => link.rel === "enclosure")
          .map((link) => ({
            url: link.href,
            mime_type: link.type,
            size_in_bytes: link.length,
          })),
      };

      if (entry.content) {
        switch (entry.content.type?.toUpperCase()) {
          case "XHTML":
          case "HTML":
            item.content_html = entry.content.value;
            break;
          default:
            item.content_text = entry.content.value;
            break;
        }
      }

      return item;
    }),
  } as JsonFeed;

  if (atom.links?.length) {
    for (const link of atom.links) {
      switch (link.rel) {
        case "self":
          feed.home_page_url = link.href;
          break;
        case "alternate":
          feed.feed_url = link.href;
          break;
      }
    }
  }

  return feed;
};
