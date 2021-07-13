import type {
	Atom,
	JsonFeed,
	JsonFeedAuthor,
	JsonFeedItem,
	RSS1,
	RSS2,
	Feed,
	FeedEntry
} from "./types/mod.ts";
import { isValidHttpURL } from "./util.ts";
import { FeedType } from "./types/mod.ts";

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
			//const rss1 = feed as RSS1;
			break;
	}

	return result;
};

export const toFeed = (
	feedType: FeedType,
	feed: Atom | RSS2 | RSS1 | JsonFeed,
): Feed | null => {
	if (!feed) {
		return null;
	}

	let result: Feed | null = null;
	switch (feedType) {
		case FeedType.Atom:
			result = mapAtomToFeed(feed as Atom);
			break;
		case FeedType.Rss2:
			result = mapRss2ToFeed(feed as RSS2);
			break;
		case FeedType.JsonFeed:
			result = mapJsonFeedToFeed(feed as JsonFeed);
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
		}
		else if (rssItem['dc:creator']) {
			author = {
				name: rssItem['dc:creator']?.[0],
			};
			authors = rssItem['dc:creator']?.map(creator => ({name: creator}));
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
			url: `${channel.cloud.domain}${channel.cloud.port ? ":" + channel.cloud.port : ""
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

		// All google feeds use this field to provide the correct url.
		if (entry["feedburner:origlink"]) {
			url = entry["feedburner:origlink"] as string;

			// Recommended but not required link field in ATOM spec.
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

const mapRss2ToFeed = (rss: RSS2): Feed => {
	const result = {
		type: FeedType.Rss2,
		entries: rss.channel?.items?.map((item) => ({
			id: item.guid,
			summary: item.description,
			link: item.link,
			published: item.pubDate,
			publishedRaw: item.pubDateRaw,
			title: item.title ? {
				type: 'text',
				value: item.title
			} : undefined,
			description: item.description ? {
				type: 'text',
				value: item.description
			}: undefined,
			creators: item["dc:creator"] ?
				item["dc:creator"]
				: undefined
		} as FeedEntry))
	}  as Feed;

	if (rss.channel) {
		result.links = rss.channel.link ? [rss.channel.link] : [];
		result.published = rss.channel.pubDate;
		result.publishedRaw = rss.channel.pubDateRaw;
		result.updateDate = rss.channel.lastBuildDate;
		result.updateDateRaw = rss.channel.lastBuildDateRaw;
		result.generator = rss.channel.generator as string;
		result.ttl = rss.channel.ttl;
		result.title = { type: 'text', value: rss.channel.title };
		result.description = rss.channel.description;
		result.copyright = rss.channel.copyright;
	}

	return result;
};

const mapAtomToFeed = (atom: Atom): Feed => {
	const result = {
		type: FeedType.Atom,
		id: atom.id,
		generator: atom.generator,
		links: atom.links?.map(x => x.href) ?? [],
		title: atom.title ?
			{
				type: atom.title.type || 'text',
				value: atom.title.value
			}
			: undefined,
		author: atom.author ?
			{
				name: atom.author.name,
				email: atom.author.email,
				uri: atom.author.uri
			}
			: undefined
	} as Feed

	return result;
};

const mapJsonFeedToFeed = (rss: JsonFeed): Feed => {
	return {} as Feed;
};
