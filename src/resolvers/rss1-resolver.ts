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
  Channel = "channel",
  Title = "title",
  Link = "link",
  Description = "description",
  Item = "item",
  Image = "image",
  TextInput = "textinput",
  About = "rdf:about",
  Resource = "rdf:resource",
}
