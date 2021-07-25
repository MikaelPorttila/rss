import { MediaRssFields } from "../types/media-rss.ts";

export const resolveMediaRssField = (
  fieldName: string,
): MediaRssResolverResult => {
  const result = {
    handled: true,
  } as MediaRssResolverResult;

  switch (fieldName) {

   /*  case DublinCoreFields.Date:
    case DublinCoreFields.Created:
    case DublinCoreFields.DateSubmitted:
    case DublinCoreFields.Copyrighted:
    case DublinCoreFields.DateAccepted:
      result.isDate = true;
      break;
    case DublinCoreFields.Valid:
      result.isDate = true;
      result.isArray = true;
      break;
		case DublinCoreFields.Contributor:
		case DublinCoreFields.Creator:
			result.isArray = true;
			break;*/
    default:
      result.handled = false;
      break;
  }

  return result;
};

interface MediaRssResolverResult {
  handled: boolean;
  isDate?: boolean;
  isNumber?: boolean;
  isArray?: boolean;
  newName?: string;
}
