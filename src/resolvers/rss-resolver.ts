import { Field } from "../types/rss.ts";

export const resolveRssField = (nodeName: string): any => {
  let isArrayNode = false;
  let isNumber = false;
  let isDate = false;
  let propertyName = nodeName;

  switch (nodeName) {
    case Field.TextInput:
      propertyName = "textInput";
      break;
    case Field.SkipHours:
      propertyName = "skipHours";
      isNumber = true;
      break;
    case Field.SkipDays:
      propertyName = "skipDays";
      isNumber = true;
      break;
    case Field.PubDate:
      propertyName = "pubDate";
      isDate = true;
      break;
    case Field.ManagingEditor:
      propertyName = "managingEditor";
      break;
    case Field.WebMaster:
      propertyName = "webMaster";
      break;
    case Field.LastBuildDate:
      propertyName = "lastBuildDate";
      isDate = true;
      break;
    case Field.Item:
      propertyName = "items";
      isArrayNode = true;
      break;
    case Field.Category:
      propertyName = "categories";
      isArrayNode = true;
      break;
    case Field.isPermaLink:
      propertyName = "isPermaLink";
      break;
    case Field.Ttl:
    case Field.Length:
    case Field.Width:
    case Field.Height:
      isNumber = true;
      break;
  }

  return [propertyName, isArrayNode, isNumber, isDate];
};
