import { MediaRssFields } from "../types/fields/mod.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveMediaRssField = (
  propertyName: string,
): ResolverResult => {
  const result = {
		propertyName,
    handled: true,
  } as ResolverResult;

  switch (propertyName) {
    case MediaRssFields.Comment:
    case MediaRssFields.Response:
    case MediaRssFields.Scene:
    case MediaRssFields.Group:
    case MediaRssFields.Content:
      result.isArray = true;
      break;
		case MediaRssFields.PriceValue:
      result.isFloat = true;
      break;
    default:
      result.handled = false;
      break;
  }

  return result;
};
