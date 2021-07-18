import { DublinCoreFields } from "../types/dublin-core.ts";

export const resolveDublinCoreField = (fieldName: string): DublinCoreResolverResult => {
	const result = {} as DublinCoreResolverResult;

	switch(fieldName) {
		case DublinCoreFields.Date:
    case DublinCoreFields.Created:
    case DublinCoreFields.DateSubmitted:
    case DublinCoreFields.Copyrighted:
    case DublinCoreFields.DateAccepted:
      result.isDate = true;
			result.handled = true;
      break;
	}

	return result;
}

interface DublinCoreResolverResult {
	handled: boolean;
	isDate?: boolean;
	isNumber?: boolean;
	isArray?: boolean;
	newName?: string;
}
