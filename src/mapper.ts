import type {
  Atom,
  Feed,
  FeedEntry,
  JsonFeed,
  JsonFeedAuthor,
  JsonFeedItem,
  RSS1,
  RSS2,
} from "./types/mod.ts";
import { isValidHttpURL } from "./util.ts";
import { FeedType } from "./types/mod.ts";
import { DublinCoreFieldArray, DublinCoreFields } from "./types/dublin-core.ts";
import { InternalAtom } from "./types/internal-atom.ts";
import { InternalRSS2 } from "./types/internal-rss2.ts";
import { InternalRSS1 } from "./types/internal-rss1.ts";

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
      const rss1 = feed as RSS1;
      break;
  }

  return result;
};

export const toFeed = (
  feedType: FeedType,
  feed: InternalAtom | InternalRSS2 | InternalRSS1 | JsonFeed,
): Feed | null => {
  if (!feed) {
    return null;
  }

  switch (feedType) {
    case FeedType.Atom:
      return mapAtomToFeed(feed as InternalAtom);
		case FeedType.Rss1:
			return mapRssToFeed(feed as InternalRSS1);
    case FeedType.Rss2:
      return mapRss2ToFeed(feed as InternalRSS2);
    case FeedType.JsonFeed:
      return mapJsonFeedToFeed(feed as JsonFeed);
    default:
      return null;
  }
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

const mapAtomToJsonFeed = (atom: Atom): JsonFeed => {
  const items: JsonFeedItem[] = atom.entries.map((entry) => {
    let author;
    let url: string | undefined;

    if (entry["feedburner:origlink"]) {
      url = entry["feedburner:origlink"];
    } else if (entry.href) {
      url = entry.href;
    } else if (isValidHttpURL(entry.id)) {
      url = entry.id;
    }

    if (entry.author) {
      author = {
        name: entry.author.name,
        url: entry.author.uri,
      };
    }

    const attachments = entry.links
      ?.filter((link) => link.rel === "enclosure")
      .map((link) => ({
        url: link.href,
        mime_type: link.type,
        size_in_bytes: link.length,
      }));

    const item: JsonFeedItem = {
      id: entry.id,
      title: entry.title?.value ?? entry.title,
      date_published: entry.published,
      date_publishedRaw: entry.publishedRaw,
      date_modified: entry.updated,
      date_modifiedRaw: entry.updatedRaw,
      summary: entry.summary?.value,
      tags: entry.categories,
      author,
      url,
      attachments,
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
  });

  const author = atom.author
    ? {
      name: atom.author.name,
      url: atom.author.uri,
    } as JsonFeedAuthor
    : undefined;

  const feed = {
    icon: atom.icon,
    title: atom.title?.value ?? atom.title,
    items,
    author,
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

const mapRssToFeed = (rss: InternalRSS1): Feed => {
	const result = {
		type: FeedType.Rss1
	} as Feed;

	if (rss.channel) {
		result.title = {
      type: undefined,
      value: rss.channel[DublinCoreFields.Title]?.value || rss.channel.title.value,
    };
		result.description = rss.channel[DublinCoreFields.Description]?.value || rss.channel.description.value;
		result.links = [(rss.channel[DublinCoreFields.URI]?.value as string || rss.channel.link.value as string)];
		result.language = rss.channel[DublinCoreFields.Language]?.value;
		result.image = rss.image
      ? {
        link: rss.image.link?.value as string,
        title: rss.image.title?.value as string,
        url: rss.image.url?.value as string,
      }
      : undefined;
		result.entries = rss?.item?.map((item) => {
			const feedEntry = {
				title: {
					type: undefined,
					value: item[DublinCoreFields.Title]?.value || item.title.value,
				},
				description: {
					type: undefined,
					value: item[DublinCoreFields.Description]?.value || item.description.value,
				},
				link: item[DublinCoreFields.URI]?.value || item.link.value
			} as FeedEntry;

			feedEntry.dc = {};
			copyDublinCoreValues(item, feedEntry.dc);

			return feedEntry;
		}) || undefined;
	}

	result.dc = {};
	copyDublinCoreValues(rss.channel, result.dc);
	return result;
};

const mapRss2ToFeed = (rss: InternalRSS2): Feed => {
  const result = {
    type: FeedType.Rss2,
  } as Feed;

  if (rss.channel) {
    result.created = result.published =
      rss.channel[DublinCoreFields.DateSubmitted]?.value || rss.channel.pubDate?.value;
    result.createdRaw = result.publishedRaw =
      rss.channel[DublinCoreFields.DateSubmittedRaw]?.value || rss.channel.pubDateRaw?.value;

    let created = rss.channel[DublinCoreFields.Created]?.value ||
      rss.channel.lastBuildDate?.value;
    let createdRaw = rss.channel[DublinCoreFields.CreatedRaw]?.value ||
      rss.channel.lastBuildDateRaw?.value;
    if (created) {
      result.created = created;
    }
    if (createdRaw) {
      result.createdRaw = createdRaw;
    }

    result.links = [(rss.channel[DublinCoreFields.URI]?.value || (rss.channel.link.value as string))];
    result.language = rss.channel[DublinCoreFields.Language]?.value || rss.channel.language?.value;
    result.updateDate = rss.channel.lastBuildDate?.value;
    result.updateDateRaw = rss.channel.lastBuildDateRaw?.value;
    result.generator = rss.channel.generator?.value;
    result.ttl = rss.channel.ttl?.value || 60;
    result.title = {
      type: undefined,
      value: rss.channel[DublinCoreFields.Title]?.value || rss.channel.title?.value,
    };
    result.description = rss.channel[DublinCoreFields.Description]?.value ||
      rss.channel.description?.value;
    result.copyright = rss.channel.copyright?.value;
    result.skipDays = rss.channel.skipDays?.day?.map(x => x.value as string);
    result.skipHours = rss.channel.skipHours?.hour?.map(x => x.value as number);
    result.webMasterMail = rss.channel.webMaster?.value;
    result.managingEditorMail = rss.channel.managingEditor?.value;
    result.image = rss.channel.image
      ? {
        link: rss.channel.image.link?.value as string,
        title: rss.channel.image.title?.value as string,
        url: rss.channel.image.url?.value as string,
        height: rss.channel.image?.height?.value,
        width: rss.channel.image?.width?.value,
      }
      : undefined;

    result.dc = {};
    copyDublinCoreValues(rss.channel, result.dc);
  }

  result.entries = rss.channel?.items?.map((item) => {
    const title = item[DublinCoreFields.Title] || item.title?.value;
    const description = item[DublinCoreFields.Description] || item.description?.value;
    const creator = item[DublinCoreFields.Creator]?.map(x => x.value);
    const publishedRaw = item[DublinCoreFields.DateSubmittedRaw] ||
      item.pubDateRaw?.value;
    const published = item[DublinCoreFields.DateSubmitted] || item.pubDate?.value;

    const entryResult = {
      id: item.guid?.value,
      link: item.link?.value,
      published,
      publishedRaw,
      updated: item.pubDate?.value,
      updatedRaw: item.pubDateRaw?.value,
      comments: item.comments?.value,
      categories: item.categories?.map((category) => ({
        term: category.value,
        label: category.value,
      })) ?? undefined,
      title: title
        ? {
          type: undefined,
          value: title,
        }
        : undefined,
      description: description
        ? {
          type: undefined,
          value: description,
        }
        : undefined,
      mediaCredit: item["media:credit"]?.value,
      mediaDescription: item["media:description"]?.value,
      mediaContent: item["media:content"]
        ? { ...item["media:content"] }
        : undefined,
      creators: creator,
    } as FeedEntry;
    entryResult.dc = {};
    copyDublinCoreValues(item, entryResult.dc);
    return entryResult;
  });

  return result;
};

const copyDublinCoreValues = (source: any, target: any): void => {
  DublinCoreFieldArray.forEach((field: string) => {
    const val = source[field];
    if (val) {
      target[field] = val?.value || val;
    }
  });
};

const mapAtomToFeed = (atom: InternalAtom): Feed => {
  const entries = atom.entries?.map((entry) => {
    let link;
    if (entry["feedburner:origlink"]) {
      link = entry["feedburner:origlink"]?.value;
    } else if (entry.links?.[0]?.href) {
      link = entry.links?.[0]?.href;
    } else if (entry.href) {
      link = entry.href;
    } else if (isValidHttpURL(entry.id.value as string)) {
      link = entry.id.value;
    }

    return {
      title: {
				type: entry.title.type,
				value: entry.title.value,
			},
      published: entry.published?.value,
      publishedRaw: entry.publishedRaw?.value,
      id: entry.id.value,
      updated: entry.updated?.value,
      updatedRaw: entry.updatedRaw?.value,
      link,
      summary: entry.summary?.value,
      source: entry.source
        ? {
          id: entry.source.id?.value,
          title: entry.source.title?.value,
          updated: entry.source.updated?.value,
          updatedRaw: entry.source.updatedRaw?.value,
        }
        : undefined,
      author: entry.author
        ? {
          email: entry.author.email?.value,
          name: entry.author.name.value,
          uri: entry.author.uri?.value,
        }
        : undefined,
      contributors: entry.contributors?.map((x) => ({
        name: x.name?.value,
        email: x.email?.value,
        uri: x.uri?.value,
      })) ?? undefined,
    } as FeedEntry;
  });

  const result = {
    type: FeedType.Atom,
    id: atom.id.value,
    generator: atom.generator?.value,
		title: {
			type: atom.title?.type,
			value: atom.title?.value,
		},
    description: atom.subtitle?.value,
    links: atom.links?.map((x) => x.href) ?? [],
    icon: atom.icon?.value,
    image: atom.logo
      ? {
        link: atom.logo?.value,
        url: atom.logo?.value,
      }
      : undefined,
    updateDate: atom.updated?.value,
    updateDateRaw: atom.updatedRaw?.value,
    categories: atom.categories?.map((category) => ({
      term: category.term,
      label: category.label,
    })) ?? undefined,
    author: atom.author
      ? {
        name: atom.author.name?.value,
        email: atom.author.email?.value,
        uri: atom.author.uri?.value,
      }
      : undefined,
    entries,
  } as Feed;

  return result;
};

const mapJsonFeedToFeed = (rss: JsonFeed): Feed => {
  return {} as Feed;
};
