import type { Feed, FeedEntry, JsonFeed } from "./types/mod.ts";
import { isValidHttpURL } from "./util.ts";
import { FeedType } from "./types/mod.ts";
import { DublinCoreFieldArray, DublinCoreFields } from "./types/dublin-core.ts";
import { SlashFieldArray, SlashFields } from './types/slash.ts';
import { InternalAtom } from "./types/internal-atom.ts";
import { InternalRSS2 } from "./types/internal-rss2.ts";
import { InternalRSS1 } from "./types/internal-rss1.ts";
import { MediaRss, MediaRssFieldArray, MediaRssFields, MediaRssValueFields } from "./types/media-rss.ts";

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
  const result = {
    type: FeedType.Rss1,
  } as Feed;

  if (rss.channel) {
    result.title = {
      type: undefined,
      value: rss.channel[DublinCoreFields.Title]?.value ||
        rss.channel.title.value,
    };
    result.description = rss.channel[DublinCoreFields.Description]?.value ||
      rss.channel.description.value;
    result.links = [
      (rss.channel[DublinCoreFields.URI]?.value as string ||
        rss.channel.link.value as string),
    ];
		result.copyright = rss.channel[DublinCoreFields.Rights]?.value;
    result.language = rss.channel[DublinCoreFields.Language]?.value;
		result.created = rss.channel[DublinCoreFields.Created]?.value || rss.channel[DublinCoreFields.DateSubmitted]?.value || rss.channel[DublinCoreFields.Date]?.value;
		result.createdRaw = rss.channel[DublinCoreFields.CreatedRaw]?.value || rss.channel[DublinCoreFields.DateSubmittedRaw]?.value || rss.channel[DublinCoreFields.DateRaw]?.value;
		result.published = rss.channel[DublinCoreFields.DateSubmitted]?.value || rss.channel[DublinCoreFields.Date]?.value;
		result.publishedRaw = rss.channel[DublinCoreFields.DateSubmittedRaw]?.value || rss.channel[DublinCoreFields.DateRaw]?.value;
		result.updateDate = rss.channel[DublinCoreFields.Date]?.value;
		result.updateDateRaw = rss.channel[DublinCoreFields.DateRaw]?.value;

    result.image = rss.image
      ? {
        link: rss.image.link?.value as string,
        title: rss.image.title?.value as string,
        url: rss.image.url?.value as string,
      }
      : undefined;
    result.entries = rss?.item?.map((item) => {

			const links: any = [];
			if (item[DublinCoreFields.URI]?.value) {
				links.push({
					href: item[DublinCoreFields.URI]?.value
				});
			}
			if (item.link.value) {
				links.push({
					href: item.link.value
				});
			}

      const feedEntry = {
				id: item[DublinCoreFields.URI]?.value || item.link.value,
        title: {
          type: undefined,
          value: item[DublinCoreFields.Title]?.value || item.title.value,
        },
        description: {
          type: undefined,
          value: item[DublinCoreFields.Description]?.value ||
            item.description.value,
        },
        links,
				published: item[DublinCoreFields.DateSubmitted]?.value || item[DublinCoreFields.Date]?.value,
				publishedRaw: item[DublinCoreFields.DateSubmittedRaw]?.value || item[DublinCoreFields.DateRaw]?.value,
				updated: item[DublinCoreFields.Date]?.value || item[DublinCoreFields.DateSubmitted]?.value,
				updatedRaw: item[DublinCoreFields.DateRaw]?.value || item[DublinCoreFields.DateSubmittedRaw]?.value,
				contributors: item[DublinCoreFields.Contributor]?.map((contributor) => ({
					name: contributor
				})),
      } as FeedEntry;

      copyFields(DublinCoreFieldArray, item, feedEntry);
      copyFields(SlashFieldArray, item, feedEntry);

      return feedEntry;
    }) || undefined;
  }

  copyFields(DublinCoreFieldArray, rss.channel, result);

  return result;
};

const mapRss2ToFeed = (rss: InternalRSS2): Feed => {
  const result = {
    type: FeedType.Rss2,
  } as Feed;

  if (rss.channel) {
    result.published = rss.channel[DublinCoreFields.DateSubmitted]?.value || rss.channel[DublinCoreFields.Date]?.value || rss.channel.pubDate?.value;
    result.publishedRaw = rss.channel[DublinCoreFields.DateSubmittedRaw]?.value || rss.channel[DublinCoreFields.DateRaw]?.value || rss.channel.pubDateRaw?.value;
		result.created = rss.channel[DublinCoreFields.Created]?.value || rss.channel.lastBuildDate?.value || result.published;
		result.createdRaw = rss.channel[DublinCoreFields.CreatedRaw]?.value || rss.channel.lastBuildDateRaw?.value || result.publishedRaw;

    if (rss.channel.webMaster?.value) {
      result.author = {
        email: rss.channel.webMaster?.value,
      };
    }

    result.docs = rss.channel.docs?.value;
    result.links = [];

		if (rss.channel[DublinCoreFields.URI]?.value) {
			result.links.push(rss.channel[DublinCoreFields.URI]?.value as string);
		}
		if (rss.channel.link?.value) {
			result.links.push(rss.channel.link?.value);
		}

    result.language = rss.channel[DublinCoreFields.Language]?.value || rss.channel.language?.value;
    result.updateDate = rss.channel.lastBuildDate?.value || rss.channel[DublinCoreFields.Date]?.value;
    result.updateDateRaw = rss.channel.lastBuildDateRaw?.value || rss.channel[DublinCoreFields.DateRaw]?.value;
    result.generator = rss.channel.generator?.value;
    result.ttl = rss.channel.ttl?.value || 60;
    result.title = {
      value: rss.channel[DublinCoreFields.Title]?.value || rss.channel.title?.value,
      type: undefined
    };

    result.description = rss.channel[DublinCoreFields.Description]?.value || rss.channel.description?.value;
    result.copyright = rss.channel.copyright?.value || rss.channel[DublinCoreFields.Rights]?.value;
    result.skipDays = rss.channel.skipDays?.day?.map((x) => x.value as string);
    result.skipHours = rss.channel.skipHours?.hour?.map((x) =>
      x.value as number
    );
    result.image = rss.channel.image
      ? {
        link: rss.channel.image.link?.value as string,
        title: rss.channel.image.title?.value as string,
        url: rss.channel.image.url?.value as string,
        height: rss.channel.image?.height?.value,
        width: rss.channel.image?.width?.value,
      }
      : undefined;

    copyFields(DublinCoreFieldArray, rss.channel, result);
  }

  result.entries = rss.channel?.items?.map((item) => {
    const title = item[DublinCoreFields.Title] || item.title?.value;
    const description = item[DublinCoreFields.Description] || item.description?.value;

    const entryResult = {
			author: item.author?.value ? {
				name: item.author?.value
			}: undefined,
      id: item.guid?.value,
      links: item.link?.value ? [{
				href: item.link?.value
			}]: undefined,
      published: item[DublinCoreFields.DateSubmitted] || item.pubDate?.value,
      publishedRaw: item[DublinCoreFields.DateSubmittedRaw] || item.pubDateRaw?.value,
      updated: item.pubDate?.value,
			attachments: item.enclosure ? item.enclosure.map(x => ({
				url: x.url,
				mimeType: x.type,
				sizeInBytes: x.length
			}))  : undefined,
      updatedRaw: item.pubDateRaw?.value,
      comments: item.comments?.value,
      categories: item.categories?.map((category) => ({
        term: category.value,
        label: category.value,
      })) ?? undefined,
      title: title
        ? {
          value: title,
          type: undefined
        }
        : undefined,
      description: description
        ? {
          value: description,
          type: undefined
        }
        : undefined,
			contributors: item[DublinCoreFields.Contributor]?.map((contributor) => ({
				name: contributor
			}))
    } as FeedEntry;

    copyMedia(item, entryResult);
    copyFields(DublinCoreFieldArray, item, entryResult);

    return entryResult;
  });

  return result;
};

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
