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
