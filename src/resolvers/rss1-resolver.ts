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
    case Field.TextInput:
      propertyName = "textInput";
      break;
    case Field.Item:
      isArray = true;
      break;
    case Field.About:
      propertyName = "about";
      break;
    case Field.Resource:
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

					if (resolverResult.isNumber) {
						isNumber = true;
					}

					if (!!resolverResult.newName) {
						propertyName = resolverResult.newName;
					}
					break;
				}
			}
      break;
  }

  return [propertyName, isArray, isNumber, isDate];
};

enum Field {
  About = "rdf:about",
  Channel = "channel",
  Description = "description",
  Image = "image",
  Item = "item",
  Link = "link",
  Resource = "rdf:resource",
  TextInput = "textinput",
  Title = "title",
}
