import { MediaRssFields } from "../types/fields/mod.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveMediaRssField = (
  fieldName: string,
): ResolverResult => {
  const result = {
    handled: true,
  } as ResolverResult;

  switch (fieldName) {
    case MediaRssFields.Comment:
    case MediaRssFields.Response:
    case MediaRssFields.Scene:
    case MediaRssFields.Group:
    case MediaRssFields.Content:
      result.isArray = true;
      break;
    case MediaRssFields.Price:
      result.isNumber = true;
      break;
    default:
      result.handled = false;
      break;
  }

  return result;
};
