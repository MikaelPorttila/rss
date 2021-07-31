import { SlashFields } from "../types/fields/mod.ts";
import { ResolverResult } from "./types/resolver-result.ts";

export const resolveSlashField = (
  name: string,
): ResolverResult => {
  const result = {
    name,
    isHandled: true,
    isArray: false,
    isInt: false,
    isFloat: false,
    isDate: false,
  } as ResolverResult;

  switch (name) {
    case SlashFields.Comments:
      result.isInt = true;
      break;
    default:
      result.isHandled = false;
      break;
  }

  return result;
};
