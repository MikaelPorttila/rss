import { resolveDublinCoreField } from "./dublin-core-resolver.ts";
import { resolveMediaRssField } from "./media-rss-resolver.ts";
import { Rss2Fields } from "./types/rss2-fields.ts";

export const resolveRss2Field = (
  nodeName: string,
): [string, boolean, boolean, boolean] => {
  let isArray = false;
  let isNumber = false;
  let isDate = false;
  let propertyName = nodeName;

  switch (nodeName) {
    case Rss2Fields.TextInput:
      propertyName = "textInput";
      break;
    case Rss2Fields.SkipHours:
      propertyName = "skipHours";
      break;
    case Rss2Fields.SkipDays:
      propertyName = "skipDays";
      break;
    case Rss2Fields.PubDate:
      propertyName = "pubDate";
      isDate = true;
      break;
    case Rss2Fields.ManagingEditor:
      propertyName = "managingEditor";
      break;
    case Rss2Fields.WebMaster:
      propertyName = "webMaster";
      break;
    case Rss2Fields.LastBuildDate:
      propertyName = "lastBuildDate";
      isDate = true;
      break;
    case Rss2Fields.Item:
      propertyName = "items";
      isArray = true;
      break;
    case Rss2Fields.Enclosure:
      isArray = true;
      break;
    case Rss2Fields.Category:
      propertyName = "categories";
      isArray = true;
      break;
    case Rss2Fields.isPermaLink:
      propertyName = "isPermaLink";
      break;
    case Rss2Fields.Ttl:
    case Rss2Fields.Length:
    case Rss2Fields.Width:
    case Rss2Fields.Height:
      isNumber = true;
      break;
    case Rss2Fields.Hour:
      isArray = true;
      isNumber = true;
      break;
    case Rss2Fields.Day:
      isArray = true;
      break;
    default:
      const subNamespaceResolvers = [
        resolveDublinCoreField,
        resolveMediaRssField,
      ];
      for (let i = 0; i < subNamespaceResolvers.length; i++) {
        const resolverResult = subNamespaceResolvers[i](propertyName);
        if (resolverResult.handled) {
          if (resolverResult.isArray) {
            isArray = true;
          }

          if (resolverResult.isDate) {
            isDate = true;
          }

          if (resolverResult.isNumber) {
            isNumber = true;
          }

          if (!!resolverResult.newName) {
            propertyName = resolverResult.newName;
          }
          break;
        }
      }
      break;
  }

  return [propertyName, isArray, isNumber, isDate];
};
