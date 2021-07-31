import { DublinCoreFields } from "../types/fields/mod.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveDublinCoreField = (
  propertyName: string,
): ResolverResult => {
  const result = {
		propertyName,
    handled: true,
  } as ResolverResult;

  switch (propertyName) {
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
