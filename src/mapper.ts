import { isEmpty } from "./str.ts";
import { Field } from "./types/field.ts";

export const mapFieldName = (name: string): string => {
  let result = name;

  if (!isEmpty(name)) {
    switch (name) {
      case Field.TextInput:
        result = "textInput";
        break;
      case Field.SkipHours:
        result = "skipHours";
        break;
      case Field.SkipDays:
        result = "skipDays";
        break;
      case Field.PubDate:
        result = "pubDate";
        break;
      case Field.ManagingEditor:
        result = "managingEditor";
        break;
      case Field.WebMaster:
        result = "webMaster";
        break;
      case Field.LastBuildDate:
        result = "lastBuildDate";
        break;
      case Field.Item:
        result = "items";
        break;
      case Field.Category:
        result = "categories";
        break;
      case Field.isPermaLink:
        result = "isPermaLink";
        break;
      default:
        result = name.toLowerCase();
        break;
    }
  }

  return result;
};
