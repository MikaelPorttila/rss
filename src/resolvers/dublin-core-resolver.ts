import { DublinCoreFields } from "../types/dublin-core.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveDublinCoreField = (
  fieldName: string,
): ResolverResult => {
  const result = {
    handled: true,
  } as ResolverResult;

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
    case DublinCoreFields.Contributor:
    case DublinCoreFields.Creator:
      result.isArray = true;
      break;
    default:
      result.handled = false;
      break;
  }

  return result;
};
