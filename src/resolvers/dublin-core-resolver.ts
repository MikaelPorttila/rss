import { DublinCoreFields } from "../types/dublin-core.ts";

export const resolveDublinCoreField = (
  fieldName: string,
): DublinCoreResolverResult => {
  const result = {
    handled: true,
  } as DublinCoreResolverResult;

  switch (fieldName) {
    case DublinCoreFields.Date:
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
		case DublinCoreFields.Creator:
			result.isArray = true;
			break;
    default:
      result.handled = false;
      break;
  }

  return result;
};

interface DublinCoreResolverResult {
  handled: boolean;
  isDate?: boolean;
  isNumber?: boolean;
  isArray?: boolean;
  newName?: string;
}
