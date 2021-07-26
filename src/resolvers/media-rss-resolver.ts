import { MediaRssFields } from "../types/media-rss.ts";
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
			result.isArray = true;
			break;
    default:
      result.handled = false;
      break;
  }

  return result;
};
