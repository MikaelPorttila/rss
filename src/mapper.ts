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
import {
	DublinCoreFields,
	DublinCoreFieldArray
} from "./types/dublin-core.ts";

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

	switch (feedType) {
		case FeedType.Atom:
			return mapAtomToFeed(feed as Atom);
		case FeedType.Rss2:
			return mapRss2ToFeed(feed as RSS2);
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
		}
		else if (rssItem[DublinCoreFields.Creator]) {
			author = {
				name: rssItem[DublinCoreFields.Creator]?.[0],
			};
			authors = rssItem[DublinCoreFields.Creator]?.map(creator => ({name: creator}));
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

const mapRss2ToFeed = (rss: RSS2): Feed => {
	const result = {
		type: FeedType.Rss2
	}  as Feed;

	if (rss.channel) {
		// ???
		result.created = result.published = rss.channel[DublinCoreFields.DateSubmitted] || rss.channel.pubDate;
		result.createdRaw = result.publishedRaw = rss.channel[DublinCoreFields.DateSubmittedRaw] || rss.channel.pubDateRaw;

		let created = rss.channel[DublinCoreFields.Created] || rss.channel.lastBuildDate;
		let createdRaw = rss.channel[DublinCoreFields.CreatedRaw] || rss.channel.lastBuildDateRaw;
		if (created) {
			result.created = created;
		}
		if (createdRaw) {
			result.createdRaw = createdRaw;
		}

		result.links = [(rss.channel[DublinCoreFields.URI] || rss.channel.link)];
		result.language = rss.channel[DublinCoreFields.Language] || rss.channel.language;
		result.updateDate = rss.channel.lastBuildDate;
		result.updateDateRaw = rss.channel.lastBuildDateRaw;
		result.generator = rss.channel.generator as string;
		result.ttl = rss.channel.ttl || 60;
		result.title = { type: undefined, value: rss.channel[DublinCoreFields.Title] || rss.channel.title };
		result.description = rss.channel[DublinCoreFields.Description] || rss.channel.description;
		result.copyright = rss.channel.copyright;
		result.skipDays = rss.channel.skipDays?.day;
		result.skipHours = rss.channel.skipHours?.hour;
		result.webMasterMail = rss.channel.webMaster;
		result.managingEditorMail = rss.channel.managingEditor;
		result.image = rss.channel.image ? {
			link: rss.channel.image.link,
			title : rss.channel.image.title,
			url: rss.channel.image.url,
			height: rss.channel.image.height,
			width: rss.channel.image.width
		}: undefined;

		result.dc = {};
		copyDublinCoreValues(rss.channel, result.dc);
	}

	result.entries = rss.channel?.items?.map((item) => {
		const title = item[DublinCoreFields.Title] || item.title;
		const description = item[DublinCoreFields.Description] || item.description;
		const creator = item[DublinCoreFields.Creator];
		const publishedRaw = item[DublinCoreFields.DateSubmittedRaw] || item.pubDateRaw;
		const published = item[DublinCoreFields.DateSubmitted] || item.pubDate;

		const entryResult = {
			id: item.guid,
			link: item.link,
			published,
			publishedRaw,
			updated: item.pubDate,
			updatedRaw: item.pubDateRaw,
			comments: item.comments,
			categories: item.categories?.map((category) => ({
				term: category,
				label: category
			})) ?? undefined,
			title: title ? {
				type: undefined,
				value: title
			} : undefined,
			description: description ? {
				type: undefined,
				value: description
			}: undefined,
			mediaCredit: item["media:credit"],
			mediaDescription: item["media:description"],
			mediaContent: item["media:content"] ? {...item["media:content"]} : undefined,
			creators: creator
		} as FeedEntry;
		entryResult.dc = {};
		copyDublinCoreValues(item, entryResult.dc);
		return entryResult;
	})

	return result;
};

const copyDublinCoreValues = (source: any, target: any): void => {
	DublinCoreFieldArray.forEach((field: string) => {
		const val = source[field];
		if (val) {
			target[field] = val;
		}
	});
}

const mapAtomToFeed = (atom: Atom): Feed => {
	const entries = atom.entries?.map((entry) => {
		let link;
		if (entry["feedburner:origlink"]) {
			link = entry["feedburner:origlink"];
		}
		else if(entry.links?.[0]?.href) {
			link = entry.links?.[0]?.href;
		}
		else if (entry.href) {
			link = entry.href;
		}
		else if (isValidHttpURL(entry.id)) {
			link = entry.id;
		}

		return {
			title: entry.title ? {
				type: entry.title.type,
				value: entry.title.value
			} : undefined,
			published: entry.published,
			publishedRaw: entry.publishedRaw,
			id: entry.id,
			updated: entry.updated,
			updatedRaw: entry.updatedRaw,
			link,
			summary: entry.summary,
			source: entry.source ?
			{
				id: entry.source.id,
				title: entry.source.title,
				updated: entry.source.updated,
				updatedRaw: entry.source.updatedRaw
			} : undefined,
			author: entry.author ?
			{
				email: entry.author.email,
				name: entry.author.name,
				uri: entry.author.uri
			} : undefined,
			contributors: entry.contributors?.map(x => ({
				name: x.name,
				email: x.email,
				uri: x.uri
			})) ?? undefined
		} as FeedEntry;
	});


	const result = {
		type: FeedType.Atom,
		id: atom.id,
		generator: atom.generator,
		description: atom.subtitle,
		links: atom.links?.map(x => x.href) ?? [],
		icon: atom.icon,
		image: atom.logo ? {
			link: atom.logo,
			url: atom.logo
		} : undefined,
		updateDate: atom.updated,
		updateDateRaw: atom.updatedRaw,
		categories: atom.categories?.map((category) => ({
			term: category.term,
			label: category.label
		})) ?? undefined,
		title: atom.title ?
			{
				type: atom.title.type,
				value: atom.title.value
			}
			: undefined,
		author: atom.author ?
			{
				name: atom.author.name,
				email: atom.author.email,
				uri: atom.author.uri
			}
			: undefined,
		entries
	} as Feed

	return result;
};

const mapJsonFeedToFeed = (rss: JsonFeed): Feed => {
	return {} as Feed;
};
