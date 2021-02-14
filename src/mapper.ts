import {
	Feed,
	RSS2,
	RSS1,
	JsonFeed,
	JsonFeedItem,
	JsonFeedAuthor,
	FeedType,
} from "./types/mod.ts";

export const toJsonFeed = (
	feedType: FeedType,
	feed: Feed | RSS2 | RSS1,
): JsonFeed | null => {

	if (!feed) {
		return null;
	}

	let result: JsonFeed | null = null;
	switch (feedType) {
		case FeedType.Atom:
			result = mapAtomToJsonFeed(feed as Feed);
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

const mapRss2ToJsonFeed = (rss: RSS2): JsonFeed => {
	const items = rss.channel.items.map((rssItem) => {
		let author, attachments;

		if (rssItem.author) {
			author = {
				name: rssItem.author,
			};
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
			attachments,
			url: rssItem.link,
			date_published: rssItem.pubDate,
			date_modified: rssItem.pubDate
		} as JsonFeedItem;
	}) || [];

	const channel = rss.channel;
	let author, hubs;

	if (channel.managingEditor || channel.webMaster) {
		author = {
			url: channel.managingEditor || channel.webMaster
		};
	}

	if (channel.cloud) {
		hubs = [{
			type: channel.cloud.protocol,
			url: `${channel.cloud.domain}${channel.cloud.port ? ':' + channel.cloud.port : ''}${channel.cloud.path}`
		}];
	}

	return {
		title: channel.title,
		description: channel.description,
		icon: channel.image?.url,
		home_page_url: channel.link,
		items,
		author,
		hubs
	} as JsonFeed;
};

const mapAtomToJsonFeed = (atom: Feed): JsonFeed => {
	const items: JsonFeedItem[] = atom.entries.map((entry) => {
		let author;
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
				size_in_bytes: link.length
			}));

		const item: JsonFeedItem = {
			id: entry.id,
			title: entry.title?.value,
			date_published: entry.published,
			date_modified: entry.updated,
			summary: entry.summary?.value,
			tags: entry.categories,
			author,
			attachments
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
		title: atom.title?.value,
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
