import { DublinCoreFields } from "../types/dublin-core.ts";
import { resolveDublinCoreField } from "./dublin-core-resolver.ts";

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
			const dublinCoreResult = resolveDublinCoreField(propertyName);
			if (dublinCoreResult.handled) {
				if (dublinCoreResult.isArray) {
					isArray = true;
				}
				if (dublinCoreResult.isDate) {
					isDate = true;
				}
				if (dublinCoreResult.isNumber) {
					isNumber = true;
				}
				if (!!dublinCoreResult.newName) {
					propertyName = dublinCoreResult.newName;
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
