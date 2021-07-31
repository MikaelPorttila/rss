import { SlashFields } from "../types/fields/mod.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveSlashField = (
  fieldName: string,
): ResolverResult => {
  const result = { handled: true } as ResolverResult;

  switch (fieldName) {
    case SlashFields.Comments:
      result.isNumber = true;
      break;
    default:
      result.handled = false;
      break;
  }

  return result;
};
