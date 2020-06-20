import { isEmpty } from "./str.ts";
import { RssField } from "./types/rss-field.ts";

export const mapFieldName = (name: string): string => {
  let result = name;

  if (!isEmpty(name)) {
    result = name;
    switch (name) {
      case RssField.TextInput:
        result = "textInput";
        break;
      case RssField.SkipHours:
        result = "skipHours";
        break;
      case RssField.SkipDays:
        result = "skipDays";
        break;
      case RssField.PubDate:
        result = "pubDate";
        break;
      case RssField.ManagingEditor:
        result = "managingEditor";
        break;
      case RssField.WebMaster:
        result = "webMaster";
        break;
      case RssField.LastBuildDate:
        result = "lastBuildDate";
        break;
      case RssField.Item:
        result = "items";
        break;
      case RssField.Category:
        result = "categories";
        break;
      case RssField.isPermaLink:
        result = "isPermaLink";
        break;
      default:
        result = name.toLowerCase();
        break;
    }
  }

  return result;
};
