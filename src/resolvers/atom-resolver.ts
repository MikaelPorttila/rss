export const resolveAtomField = (
  nodeName: string,
): [string, boolean, boolean, boolean] => {
  let isArrayNode = false;
  let isNumber = false;
  let isDate = false;
  let propertyName = nodeName;

  switch (nodeName) {
    case Field.Category:
      propertyName = "categories";
      isArrayNode = true;
      break;
    case Field.Contributor:
      propertyName = "contributors";
      isArrayNode = true;
      break;
    case Field.Link:
      propertyName = "links";
      isArrayNode = true;
      break;
    case Field.Entry:
      propertyName = "entries";
      isArrayNode = true;
      break;
    case Field.Updated:
    case Field.Published:
      propertyName = nodeName;
      isDate = true;
      break;
    default:
      propertyName = nodeName;
  }

  return [propertyName, isArrayNode, isNumber, isDate];
};

export const isAtomCDataField = (nodeName: string): boolean => {
  switch(nodeName) {
    case Field.Title:
    case Field.Summary:
    case Field.Content:
    case Field.Rights:
      return true;
  }

  return false;
}

enum Field {
  Feed = "feed",
  Id = "id",
  Title = "title",
  Icon = "icon",
  Updated = "updated",
  Link = "link",
  Entry = "entry",
  Category = "category",
  Type = "type",
  Href = "href",
  Rel = "rel",
  Author = "author",
  Contributor = "contributor",
  Summary = "summary",
  Rights = "rights",
  Source = "source",
  Src = "src",
  Value = "value",
  Name = "name",
  Published = "published",
  Email = "email",
  Uri = "uri",
  Content = "content"
}
