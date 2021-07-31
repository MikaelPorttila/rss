import { AtomFields } from "../types/fields/mod.ts";
import { resolveDublinCoreField } from "./dublin-core-resolver.ts";

export const resolveAtomField = (
  nodeName: string,
): [string, boolean, boolean, boolean] => {
  let isArray = false;
  let isNumber = false;
  let isDate = false;
  let propertyName = nodeName;

  switch (nodeName) {
    case AtomFields.Category:
      propertyName = "categories";
      isArray = true;
      break;
    case AtomFields.Contributor:
      propertyName = "contributors";
      isArray = true;
      break;
    case AtomFields.Link:
      propertyName = "links";
      isArray = true;
      break;
    case AtomFields.Entry:
      propertyName = "entries";
      isArray = true;
      break;
    case AtomFields.Updated:
    case AtomFields.Published:
      isDate = true;
      break;
    default:
      const resolverResult = resolveDublinCoreField(propertyName);
      if (resolverResult.handled) {
        if (resolverResult.isArray) {
          isArray = true;
        }

        if (resolverResult.isDate) {
          isDate = true;
        }

        if (resolverResult.isInt || resolverResult.isFloat) {
          isNumber = true;
        }

				propertyName = resolverResult.propertyName;
      }
      break;
  }

  return [propertyName, isArray, isNumber, isDate];
};

export const isAtomCDataField = (nodeName: string): boolean => {
  switch (nodeName) {
    case AtomFields.Title:
    case AtomFields.Summary:
    case AtomFields.Content:
    case AtomFields.Rights:
      return true;
  }

  return false;
};
