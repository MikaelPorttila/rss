import { SlashFields } from "../types/fields/mod.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveSlashField = (
  propertyName: string,
): ResolverResult => {
  const result = {
		propertyName,
		handled: true
	} as ResolverResult;

  switch (propertyName) {
    case SlashFields.Comments:
      result.isInt = true;
      break;
    default:
      result.handled = false;
      break;
  }

  return result;
};
