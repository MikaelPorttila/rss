import { Rss1Fields } from "../types/fields/mod.ts";
import { resolveDublinCoreField } from "./dublin-core-resolver.ts";
import { resolveSlashField } from "./slash-resolver.ts";

export const resolveRss1Field = (
  nodeName: string,
): [string, boolean, boolean, boolean] => {
  let isArray = false;
  let isNumber = false;
  let isDate = false;
  let propertyName = nodeName;

  switch (nodeName) {
    case Rss1Fields.TextInput:
      propertyName = "textInput";
      break;
    case Rss1Fields.Item:
      isArray = true;
      break;
    case Rss1Fields.About:
      propertyName = "about";
      break;
    case Rss1Fields.Resource:
      propertyName = "resource";
      break;
    default:
      const subNamespaceResolvers = [resolveDublinCoreField, resolveSlashField];
      for (let i = 0; i < subNamespaceResolvers.length; i++) {
        const resolverResult = subNamespaceResolvers[i](propertyName);
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
          break;
        }
      }
      break;
  }

  return [propertyName, isArray, isNumber, isDate];
};
