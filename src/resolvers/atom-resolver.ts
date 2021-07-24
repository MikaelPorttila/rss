import { resolveDublinCoreField } from "./dublin-core-resolver.ts";

export const resolveAtomField = (
  nodeName: string,
): [string, boolean, boolean, boolean] => {
  let isArray = false;
  let isNumber = false;
  let isDate = false;
  let propertyName = nodeName;

  switch (nodeName) {
    case Field.Category:
      propertyName = "categories";
      isArray = true;
      break;
    case Field.Contributor:
      propertyName = "contributors";
      isArray = true;
      break;
    case Field.Link:
      propertyName = "links";
      isArray = true;
      break;
    case Field.Entry:
      propertyName = "entries";
      isArray = true;
      break;
    case Field.Updated:
    case Field.Published:
      isDate = true;
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

export const isAtomCDataField = (nodeName: string): boolean => {
  switch (nodeName) {
    case Field.Title:
    case Field.Summary:
    case Field.Content:
    case Field.Rights:
      return true;
  }

  return false;
};

enum Field {
  Author = "author",
  Category = "category",
  Content = "content",
  Contributor = "contributor",
  Email = "email",
  Entry = "entry",
  Feed = "feed",
  Href = "href",
  Icon = "icon",
  Id = "id",
  Link = "link",
  Name = "name",
  Published = "published",
  Rel = "rel",
  Rights = "rights",
  Source = "source",
  Src = "src",
  Summary = "summary",
  Title = "title",
  Type = "type",
  Updated = "updated",
  Uri = "uri",
  Value = "value",
}
