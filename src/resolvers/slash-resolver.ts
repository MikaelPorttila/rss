import { SlashFields } from "../types/slash.ts";

export const resolveSlashField = (
  fieldName: string,
): SlashResolverResult => {
  const result = { handled: true } as SlashResolverResult;

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

interface SlashResolverResult {
  handled: boolean;
  isDate?: boolean;
  isNumber?: boolean;
  isArray?: boolean;
  newName?: string;
}
