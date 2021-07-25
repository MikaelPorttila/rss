import type { Feed, FeedEntry, JsonFeed } from "./types/mod.ts";
import { isValidHttpURL } from "./util.ts";
import { FeedType } from "./types/mod.ts";
import { DublinCoreFieldArray, DublinCoreFields } from "./types/dublin-core.ts";
import { SlashFieldArray, SlashFields } from './types/slash.ts';
import { InternalAtom } from "./types/internal-atom.ts";
import { InternalRSS2 } from "./types/internal-rss2.ts";
import { InternalRSS1 } from "./types/internal-rss1.ts";

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
      } as FeedEntry;

      feedEntry.dc = {};
      feedEntry.slash = {};

      copyFields(DublinCoreFieldArray, item, feedEntry.dc);
      copyFields(SlashFieldArray, item, feedEntry.slash);

      return feedEntry;
    }) || undefined;
  }

  result.dc = {};
  copyFields(DublinCoreFieldArray, rss.channel, result.dc);

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

    result.language = rss.channel[DublinCoreFields.Language]?.value ||
      rss.channel.language?.value;
    result.updateDate = rss.channel.lastBuildDate?.value || rss.channel[DublinCoreFields.Date]?.value;
    result.updateDateRaw = rss.channel.lastBuildDateRaw?.value || rss.channel[DublinCoreFields.DateRaw]?.value;
    result.generator = rss.channel.generator?.value;
    result.ttl = rss.channel.ttl?.value || 60;
    result.title = {
      type: undefined,
      value: rss.channel[DublinCoreFields.Title]?.value ||
        rss.channel.title?.value,
    };
    result.description = rss.channel[DublinCoreFields.Description]?.value ||
      rss.channel.description?.value;
    result.copyright = rss.channel.copyright?.value || rss.channel[DublinCoreFields.Rights]?.value;
    result.skipDays = rss.channel.skipDays?.day?.map((x) => x.value as string);
    result.skipHours = rss.channel.skipHours?.hour?.map((x) =>
      x.value as number
    );
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
    copyFields(DublinCoreFieldArray, rss.channel, result.dc);
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
    } as FeedEntry;
    entryResult.dc = {};
    copyFields(DublinCoreFieldArray, item, entryResult.dc);

    return entryResult;
  });

  return result;
};


const copyFields = (fields: string[], source: any, target: any) => {
  fields.forEach((fieldName: string) => {
    const val = source[fieldName];
    if (val) {

      target[fieldName] = Array.isArray(val)
				? val.map(x => (x?.value || x))
				: (val?.value || val);

			if (fieldName === DublinCoreFields.Creator) {
				console.log(DublinCoreFields.Creator, target[fieldName]);
			}
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
        type: entry.title.type,
        value: entry.title.value,
      },
      published: entry.published?.value,
      publishedRaw: entry.publishedRaw?.value,
      id: entry.id.value,
      updated: entry.updated?.value,
      updatedRaw: entry.updatedRaw?.value,
      links,
      description: {
        type: entry.summary?.type,
        value: entry.summary?.value,
      },
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
			content: entry.content ?
			{
				type: entry.content?.type,
				value: entry.content?.value
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
      type: atom.title?.type,
      value: atom.title?.value,
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
