import type { Feed, FeedEntry, JsonFeed } from "./types/mod.ts";
import { isValidHttpURL } from "./util.ts";
import { FeedType } from "./types/mod.ts";
import { DublinCoreFieldArray, DublinCoreFields } from "./types/dublin-core.ts";
import { SlashFieldArray } from './types/slash.ts';
import { InternalAtom } from "./types/internal-atom.ts";
import { InternalRSS2 } from "./types/internal-rss2.ts";
import { InternalRSS1 } from "./types/internal-rss1.ts";
import { MediaRss, MediaRssFields, MediaRssValueFields } from "./types/media-rss.ts";

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

const mapRssToFeed = (rss: InternalRSS1): Feed => {

	const {
		title,
		description,
		link,
		...rest
	} = rss.channel;

	const result = (rest as any) as Feed;
	copyFields(DublinCoreFieldArray, rss.channel, result);
	result.type = FeedType.Rss1;

	const titleValue = result[DublinCoreFields.Title] || title?.value;
	if (titleValue) {
		result.title = {
			value: titleValue,
			type: undefined
		}
	}

	result.links = [];
	if (result[DublinCoreFields.URI]) {
		result.links.push(result[DublinCoreFields.URI] as string);
	}

	if(link?.value) {
		result.links.push(link.value);
	}

	result.description = result[DublinCoreFields.Description] || description?.value
	result.copyright = result[DublinCoreFields.Rights];
	result.language = result[DublinCoreFields.Language];
	result.created = result[DublinCoreFields.Created] || result[DublinCoreFields.DateSubmitted] || result[DublinCoreFields.Date];
	result.createdRaw = result[DublinCoreFields.CreatedRaw] || result[DublinCoreFields.DateSubmittedRaw] || result[DublinCoreFields.DateRaw];
	result.published = result[DublinCoreFields.DateSubmitted] || result[DublinCoreFields.Date];
	result.publishedRaw = result[DublinCoreFields.DateSubmittedRaw] || result[DublinCoreFields.DateRaw];
	result.updateDate = result[DublinCoreFields.Date];
	result.updateDateRaw = result[DublinCoreFields.DateRaw];

	if (rss.image) {
		result.image = {
			link: rss.image.link?.value as string,
			title: rss.image.title?.value as string,
			url: rss.image.url?.value as string,
		};
	}

	result.entries = rss.item?.map((item) => {
		const {
			link,
			title,
			description,
			...itemRest
		} = item;

		const entry = (itemRest as any) as FeedEntry;
		copyFields(DublinCoreFieldArray, entry, entry);
		copyFields(SlashFieldArray, entry, entry);

		entry.id = entry[DublinCoreFields.URI] || link?.value as string;
		entry.published = entry[DublinCoreFields.DateSubmitted] || entry[DublinCoreFields.Date];
		entry.publishedRaw = entry[DublinCoreFields.DateSubmittedRaw] || entry[DublinCoreFields.DateRaw];
		entry.updated = entry[DublinCoreFields.Date] || entry[DublinCoreFields.DateSubmitted];
		entry.updatedRaw = entry[DublinCoreFields.DateRaw] || entry[DublinCoreFields.DateSubmittedRaw];

		const itemTitle = entry[DublinCoreFields.Title] || title?.value;
		if (itemTitle) {
			entry.title = {
				value: itemTitle,
				type: undefined
			};
		}

		const itemDescription = entry[DublinCoreFields.Description] || description?.value;
		if (itemDescription) {
			entry.description = {
				value: itemDescription,
				type: undefined
			};
		}

		entry.links = [];
		if (entry[DublinCoreFields.URI]) {
			entry.links.push({
				href: entry[DublinCoreFields.URI]
			});
		}

		if (link?.value) {
			entry.links.push({
				href: link.value
			});
		}

		entry.contributors = entry[DublinCoreFields.Contributor]?.map((contributor) => ({
			name: contributor
		}));

		return entry;
	})

  return result;
};

const mapRss2ToFeed = (rss: InternalRSS2): Feed => {
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

	const result = (rest as any) as Feed;
	result.type = FeedType.Rss2;
	copyFields(DublinCoreFieldArray, result, result);

	result.title = {
		value: result[DublinCoreFields.Title] || title?.value,
		type: undefined
	};

	const commonDate = result[DublinCoreFields.DateSubmitted] || result[DublinCoreFields.Date] || pubDate?.value;
	const commonDateRaw = result[DublinCoreFields.DateSubmittedRaw] || result[DublinCoreFields.DateRaw] || pubDateRaw?.value;

	result.description = description?.value || result[DublinCoreFields.Description];
	result.generator = generator?.value;
	result.published = commonDate;
	result.publishedRaw = commonDateRaw;
	result.created = result[DublinCoreFields.Created] || lastBuildDate?.value || commonDate;
	result.createdRaw = result[DublinCoreFields.CreatedRaw] || lastBuildDateRaw?.value || commonDateRaw;
	result.updateDate = lastBuildDate?.value || result[DublinCoreFields.Date];
	result.updateDateRaw = lastBuildDateRaw?.value || result[DublinCoreFields.DateRaw];
	result.docs = docs?.value;
	result.language = language?.value;
	result.copyright = copyright?.value || result[DublinCoreFields.Rights];
	result.ttl = ttl?.value;
	result.skipDays = skipDays?.day?.map(x => x.value as string);
	result.skipHours = skipHours?.hour?.map(x => x.value as number);
	result.links = [
		link?.value,
		result[DublinCoreFields.URI]
	].filter(x => !!x) as string[];

	if (webMaster?.value) {
		result.author = createAuthor(webMaster.value);
	}

	if (image) {
		result.image = {
			link: image.link?.value as string,
			title: image.title?.value as string,
			url: image.url?.value as string,
			height: image?.height?.value,
			width: image?.width?.value,
		};
	}

	result.entries = items.map((item) => {
		const {
			author,
			title,
			description,
			guid,
			link,
			pubDate,
			pubDateRaw,
			enclosure,
			comments,
			categories,
			...itemRest
		} = item;

		const entry = itemRest as FeedEntry;
		copyFields(DublinCoreFieldArray, entry, entry);

		entry.id = guid?.value as string || entry[DublinCoreFields.URI] as string;

		const titleValue = entry[DublinCoreFields.Title] || title?.value;
		if (titleValue) {
			entry.title = {
				value: titleValue,
				type: undefined
			};
		}

		const descriptionValue = entry[DublinCoreFields.Description] || description?.value;
		if (descriptionValue) {
			entry.description = {
				value: descriptionValue,
				type: undefined
			};
		}

		entry.comments = comments?.value;
		entry.published = entry[DublinCoreFields.DateSubmitted] || pubDate?.value;
		entry.publishedRaw = entry[DublinCoreFields.DateSubmittedRaw] || pubDateRaw?.value;
		entry.updated = pubDate?.value;
		entry.updatedRaw = item.pubDateRaw?.value;

		if (author?.value) {
			entry.author = createAuthor(undefined, author.value);
		}

		if (link?.value) {
			entry.links = [{ href: link?.value }];
		}

		if(enclosure) {
			entry.attachments = enclosure.map(x => ({
				url: x.url,
				mimeType: x.type,
				sizeInBytes: x.length
			}));
		}

		entry.categories = categories?.map((category) => ({
			term: category.value,
			label: category.value,
		}));

		entry.contributors = result[DublinCoreFields.Contributor]?.map((contributor) => ({
			name: contributor
		}));

		return entry;
	});

	return (result as any);
};

const createAuthor = (email?: string, name?: string, uri?: string) => ({
	email,
	name,
	uri
});

//  copyMedia(item, entryResult);
const copyMedia = (source: MediaRssValueFields, target: MediaRss) => {
	[
		MediaRssFields.Rating,
		MediaRssFields.Group,
		MediaRssFields.Keywords,
		MediaRssFields.Category
	].forEach((fieldName) => {
		const val = (source as any)[fieldName];
		if (val) {
			(target as any)[fieldName] = (val as any).value;
		}
	});

	const credit = source[MediaRssFields.Credit];
	if (credit) {
		target[MediaRssFields.Credit] = {
			value: credit.value,
			role: credit.role,
			scheme: credit.scheme
		};
	}

	const title = source[MediaRssFields.Title];
	if (title) {
		target[MediaRssFields.Title] = {
			value: title.value,
			type: title.type
		}
	}

	const description = source[MediaRssFields.Description];
	if (description) {
		target[MediaRssFields.Description] = {
			value: description.value,
			type: description.type
		};
	}

	const content = source[MediaRssFields.Content];
	if (content) {
		target[MediaRssFields.Content] = {
			bitrate: content.bitrate,
			channels: content.channels,
			duration: content.duration,
			expression: content.expression,
			fileSize: content.fileSize,
			height: content.height,
			width: content.width,
			isDefault: content.isDefault,
			lang: content.lang,
			medium: content.medium,
			samplingrate: content.samplingrate,
			type: content.type,
			url: content.url
		};
	}

	const thumbnails = source[MediaRssFields.Thumbnails];
	if (thumbnails) {
		target[MediaRssFields.Thumbnails] = {
			url: thumbnails.url,
			height: thumbnails.height,
			width: thumbnails.width,
			time: thumbnails.time
		};
	}

	const hash = source[MediaRssFields.Hash];
	if (hash) {
		target[MediaRssFields.Hash] = {
			value: hash.value,
			algo: hash.algo
		};
	}

	const player = source[MediaRssFields.Player];
	if (player) {
		target[MediaRssFields.Player] = {
			url: player.url,
			height: player.height,
			width: player.width
		};
	}

	const copyright = source[MediaRssFields.Copyright];
	if (copyright) {
		target[MediaRssFields.Copyright] = {
			url: copyright.url,
			value: copyright.value
		};
	}

	const text = source[MediaRssFields.Text];
	if (text) {
		target[MediaRssFields.Text] = {
			value: text.value,
			type: text.value,
			lang: text.value,
			start: text.start,
			end: text.end
		};
	}

	const restriction = source[MediaRssFields.Restriction];
	if (restriction) {
		target[MediaRssFields.Restriction] = {
			value: restriction.value,
			relationship: restriction.relationship,
			type: restriction.type
		};
	}

	const comments = source[MediaRssFields.Comments];
	if (comments) {
		target[MediaRssFields.Comments] = {
			'media:comment': comments[MediaRssFields.Comment]?.map(x => x.value) as string[]
		};
	}

	const embed = source[MediaRssFields.Embed];
	if (embed) {
		const mediaParam = embed[MediaRssFields.Param];
		target[MediaRssFields.Embed] = {
			url: embed.url,
			height: embed.height,
			width: embed.width,
			'media:param': mediaParam ? {
				value: mediaParam?.value,
				name: mediaParam?.name
			} : undefined
		};
	}

	const responses = source[MediaRssFields.Responses];
	if (responses) {
		target[MediaRssFields.Responses] = {
			'media:response': responses[MediaRssFields.Response]?.map(x => x.value) as string[]
		}
	}

	const backLinks = source[MediaRssFields.BackLinks];
	if (backLinks) {
		target[MediaRssFields.BackLinks] = {
			'media:backLink': backLinks[MediaRssFields.BackLink]?.map(x => x.value) as string[]
		}
	}

	const status = source[MediaRssFields.Status];
	if (status) {
		target[MediaRssFields.Status] = {
			state: status.state,
			reason: status.reason
		};
	}

	const price  = source[MediaRssFields.Price];
	if (price) {
		target[MediaRssFields.Price] = {
			type: price.type,
			price: price.price,
			info: price.info,
			currency: price.currency
		};
	}

	const license = source[MediaRssFields.License];
	if (license) {
		target[MediaRssFields.License] = {
			value: license.value,
			type: license.type,
			href: license.href
		};
	}

	const subtitle = source[MediaRssFields.Subtitle];
	if (subtitle) {
		target[MediaRssFields.Subtitle] = {
			type: subtitle.type,
			lang: subtitle.lang,
			href: subtitle.href
		};
	}

	const peerLink = source[MediaRssFields.PeerLink];
	if (peerLink) {
		target[MediaRssFields.PeerLink] = {
			type: peerLink.type,
			href: peerLink.href
		};
	}

	const rights = source[MediaRssFields.Rights];
	if (rights) {
		target[MediaRssFields.Rights] = {
			status: rights.status
		};
	}

	const scenes = source[MediaRssFields.Scenes];
	if (scenes) {
		target[MediaRssFields.Scenes] = {
			'media:scene': scenes[MediaRssFields.Scene]?.map(x => ({
				sceneTitle: x.sceneTitle,
				sceneDescription: x.sceneDescription,
				sceneStartTime: x.sceneStartTime,
				sceneEndTime: x.sceneEndTime
			})) as []
		}
	}
}

const copyFields = (fields: string[], source: any, target: any) => {
  fields.forEach((fieldName: string) => {
    const val = source[fieldName];
    if (val) {
      target[fieldName] = Array.isArray(val)
				? val.map(x => (x?.value || x))
				: (val?.value || val);
    }
  });
}

const mapAtomToFeed = (atom: InternalAtom): Feed => {
  const entries = atom.entries?.map((entry) => {
    let links = [];
    if (entry["feedburner:origlink"]) {
      links.push({
				href: entry["feedburner:origlink"]?.value
			});
    }

		if (entry.links && entry.links.length > 0) {
			for(const link of entry.links) {
				links.push({
					href: link.href,
					rel: link.rel,
					type: link.type,
					length: link.length
				});
			}
		}

		if (entry.href) {
			links.push({
				href: entry.href
			});
		}

		if (isValidHttpURL(entry.id.value as string)) {
			links.push({
				href: entry.id.value
			});
		}

    return {
      title: {
        value: entry.title.value,
        type: entry.title.type
      },
      published: entry.published?.value,
      publishedRaw: entry.publishedRaw?.value,
      id: entry.id.value,
      updated: entry.updated?.value,
      updatedRaw: entry.updatedRaw?.value,
      links,
      description: {
        value: entry.summary?.value,
        type: entry.summary?.type
      },
      source: entry.source
        ? {
          id: entry.source.id?.value,
          title: entry.source.title?.value,
          updated: entry.source.updated?.value,
          updatedRaw: entry.source.updatedRaw?.value
        }
        : undefined,
      author: entry.author
        ? {
          email: entry.author.email?.value,
          name: entry.author.name.value,
          uri: entry.author.uri?.value,
        }
        : undefined,
			content: entry.content ?
			{
				value: entry.content?.value,
				type: entry.content?.type
			}: undefined,
      contributors: entry.contributors?.map((x) => ({
        name: x.name?.value,
        email: x.email?.value,
        uri: x.uri?.value,
      })) ?? undefined,
      categories: atom.categories?.map((x) => ({
        term: x.term,
        label: x.label,
      })),
      attachments: atom.links
        ?.filter((x) => x.rel === "enclosure")
        ?.map((x) => ({
          url: x.href,
          mimeType: x.type,
          sizeInBytes: x.length,
        })),
    } as FeedEntry;
  });

  const result = {
    type: FeedType.Atom,
    id: atom.id.value,
    generator: atom.generator?.value,
    title: {
      value: atom.title?.value,
      type: atom.title?.type
    },
    description: atom.subtitle?.value,
    links: atom.links?.map((x) => x.href) ?? [],
    icon: atom.icon?.value,
    image: atom.logo
      ? {
        link: atom.logo.value,
        url: atom.logo.value,
      }
      : undefined,
    updateDate: atom.updated?.value,
    updateDateRaw: atom.updatedRaw?.value,
    published: atom.updated?.value,
    publishedRaw: atom.updatedRaw?.value,
    created: atom.updated.value,
    createdRaw: atom.updatedRaw.value,
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
