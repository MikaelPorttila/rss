import { DublinCoreFields } from "../types/dublin-core.ts";

export const resolveRss1Field = (
	nodeName: string,
): [string, boolean, boolean, boolean] => {
	let isArrayNode = false;
	let isNumber = false;
	let isDate = false;
	let propertyName = nodeName;

	switch (nodeName) {
		case Field.TextInput:
			propertyName = "textInput";
			break;
		case Field.Item:
			propertyName = "items";
			isArrayNode = true;
			break;
		case Field.About:
			propertyName = "about";
			break;
		case Field.Resource:
			propertyName = "resource";
			break;
		case DublinCoreFields.Date:
		case DublinCoreFields.Created:
		case DublinCoreFields.DateSubmitted:
		case DublinCoreFields.Copyrighted:
		case DublinCoreFields.DateAccepted:
			isDate = true;
			break;
	}

	return [propertyName, isArrayNode, isNumber, isDate];
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
