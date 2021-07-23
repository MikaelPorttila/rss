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

export const toLegacyRss1 = (rss :InternalRSS1): RSS1 => {
	const result = { } as RSS1;
	if (rss.channel) {
		result.channel = {
			title: rss.channel.title?.value as string,
			description: rss.channel.description?.value as string,
			link: rss.channel.link?.value as string,
			about: rss.channel.link?.value as string
		};
	}

	if (rss.image) {
		result.image = {
			title: rss.image.title?.value as string,
			link: rss.image.link?.value as string,
			about: rss.image.about,
			url: rss.image.url?.value as string,
			resource: rss.image.resource
		};
	}

	result.item = rss.item?.map(item => {
		return {
			title: item.title?.value as string,
			description: item.description?.value as string,
			link: item.link?.value as string
		};
	});

	if (rss.textInput) {
		result.textInput = {
			title: rss.textInput.title?.value as string,
			about: rss.textInput.about,
			description: rss.textInput.description?.value as string,
			link: rss.textInput.link?.value as string,
			name: rss.textInput.name?.value as string
		};
	}

	return result;
}

export const toLegacyRss2 = (rss: InternalRSS2): RSS2 => {
	const result = {} as RSS2;

	if (rss.channel) {
		const image = rss.channel.image ? {
			url: rss.channel.image.url?.value,
			title: rss.channel.image.title?.value,
			link: rss.channel.image.link?.value,
			width: rss.channel.image.width?.value,
			height: rss.channel.image.height?.value
		} : undefined as any;

		const skipHours = (rss.channel.skipHours && rss.channel.skipHours.hour && rss.channel.skipHours.hour.length > 0) ? {
			hour: rss.channel.skipHours.hour?.map(x => x.value)
		} : undefined as any;

		const skipDays = (rss.channel.skipDays && rss.channel.skipDays.day && rss.channel.skipDays.day.length > 0) ? {
			day: rss.channel.skipDays.day?.map(x => x.value)
		} : undefined as any;

		result.channel = {
			title: rss.channel.title?.value as string,
			description: rss.channel.description?.value as string,
			language: rss.channel.language?.value as string,
			link: rss.channel.link?.value as string,
			ttl: rss.channel.ttl?.value,
			docs: rss.channel.docs?.value,
			image,
			skipHours,
			skipDays,
			copyright: rss.channel.copyright?.value,
			managingEditor: rss.channel.managingEditor?.value,
			lastBuildDate: rss.channel.lastBuildDate?.value,
			lastBuildDateRaw: rss.channel.lastBuildDateRaw?.value,
			webMaster: rss.channel.webMaster?.value,
			pubDate: rss.channel.pubDate?.value,
			pubDateRaw: rss.channel.pubDateRaw?.value,
			generator: rss.channel.generator?.value,
			category: rss.channel.category?.map((x) => x.value as string),
			items: rss.channel.items?.map((item, index) => {

				let author;
				const dublinCoreCreator = item[DublinCoreFields.Creator]
				if (dublinCoreCreator && dublinCoreCreator.length > 0) {
					author = dublinCoreCreator[0].value;
				}

				if (!author) {
					author = item.author?.value;
				}

				const itemResult =  {
					guid: item.guid?.value,
					pubDate: item.pubDate?.value,
					pubDateRaw: item.pubDateRaw?.value,
					title: item.title?.value,
					description: item.description?.value,
					link: item.link?.value,
					author,
					comments: item.comments?.value,
					categories: item.categories?.map((x) => x.value as string),
					"media:credit": item["media:credit"]?.value,
					"media:description": item["media:description"]?.value,
					"media:content": {}
				};

				const mediaContent = item["media:content"];
				if (mediaContent) {
					itemResult["media:content"] = {
						height: mediaContent.height,
						width: mediaContent.width,
						medium: mediaContent.medium,
						url: mediaContent.url,
					};
				}

				copyDublinCoreValues(item, itemResult);
				return itemResult;
			})
		};

		copyDublinCoreValues(rss.channel, result.channel);
	}

	return result;
}

export const toLegacyAtom = (atom: InternalAtom): Atom => {
	const result = {
		title: {
			type: atom.title?.type,
			value: atom.title?.value
		},
		id: atom.id?.value,
		icon: atom.icon?.value,
		logo: atom.logo?.value,
		updated: atom.updated?.value,
		updatedRaw: atom.updatedRaw?.value,
		links: atom.links?.map(x => ({
			href: x.href,
			rel: x.rel,
			type: x.type,
			length: x.length
		})),
		categories: atom.categories?.map(x => ({
			term: x.term,
			label: x.label
		})),
		subtitle: atom.subtitle?.value,
		author: {
			name: atom.author?.name?.value,
			email: atom.author?.email?.value,
			uri: atom.author?.uri?.value
		},
		entries: atom.entries?.map(entry => {
			const entryResult = {
				id: entry.id?.value,
				title: {
					type: entry.title?.type,
					value: entry.title?.value
				},
				updated: entry.updated?.value,
				updatedRaw: entry.updatedRaw?.value,
				published: entry.published?.value,
				publishedRaw: entry.publishedRaw?.value,
				href: entry.href,
				content: {
					type: entry.content?.type,
					src: entry.content?.src,
					value: entry.content?.value
				},
				links: entry.links?.map(x => ({
					type: x.type,
					href: x.href,
					rel: x.rel,
					length: x.length
				})),
				author: {
					name: entry.author?.name?.value,
					email: entry.author?.email?.value,
					uri: entry.author?.uri?.value
				},
				contributors: entry.contributors?.map(contributor => ({
					name: contributor?.name?.value,
					email: contributor?.email?.value,
					uri: contributor?.uri?.value
				})),
				summary: {
					type: entry.summary?.type,
					value: entry.summary?.value
				},
				rights: {
					type: entry.rights?.type,
					value: entry.rights?.value
				},
				categories: entry.categories?.map(category => ({
					label: category.label,
					term: category.term
				})),
				source: {
					id: entry.source?.id?.value,
					title: entry.source?.title?.value,
					updated: entry.source?.updated?.value,
					updatedRaw: entry.source?.updatedRaw?.value
				}
			};
			return entryResult;
		})
	} as Atom;
	return result;
}

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
      tags: entry.categories?.map(x => x.term),
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

const copyDublinCoreValues = (source: any, target: any): void => {
  DublinCoreFieldArray.forEach((field: string) => {
    const val = source[field];
    if (val) {
      target[field] = val?.value || val;
    }
  });
};
