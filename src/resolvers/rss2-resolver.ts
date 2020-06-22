export const resolveRss2Field = (
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
    case Field.SkipHours:
      propertyName = "skipHours";
      isNumber = true;
      break;
    case Field.SkipDays:
      propertyName = "skipDays";
      isNumber = true;
      break;
    case Field.PubDate:
      propertyName = "pubDate";
      isDate = true;
      break;
    case Field.ManagingEditor:
      propertyName = "managingEditor";
      break;
    case Field.WebMaster:
      propertyName = "webMaster";
      break;
    case Field.LastBuildDate:
      propertyName = "lastBuildDate";
      isDate = true;
      break;
    case Field.Item:
      propertyName = "items";
      isArrayNode = true;
      break;
    case Field.Category:
      propertyName = "categories";
      isArrayNode = true;
      break;
    case Field.isPermaLink:
      propertyName = "isPermaLink";
      break;
    case Field.Ttl:
    case Field.Length:
    case Field.Width:
    case Field.Height:
      isNumber = true;
      break;
  }

  return [propertyName, isArrayNode, isNumber, isDate];
};

enum Field {
  Channel = "channel",
  Title = "title",
  Link = "link",
  Ttl = "ttl",
  Description = "description",
  Item = "item",
  Language = "language",
  Copyright = "copyright",
  ManagingEditor = "managingeditor",
  WebMaster = "webmaster",
  PubDate = "pubdate",
  LastBuildDate = "lastbuilddate",
  Category = "category",
  Generator = "generator",
  Docs = "docs",
  Cloud = "cloud",
  Image = "image",
  TextInput = "textinput",
  SkipHours = "skiphours",
  SkipDays = "skipdays",
  Author = "author",
  Enclosure = "enclosure",
  Guid = "guid",
  Source = "source",
  Url = "url",
  Width = "width",
  Height = "height",
  Length = "length",
  isPermaLink = "ispermalink",
}
