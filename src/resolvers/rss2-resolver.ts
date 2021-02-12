export const resolveRss2Field = (
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
      isArray = true;
      break;
    case Field.Category:
      propertyName = "categories";
      isArray = true;
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

  return [propertyName, isArray, isNumber, isDate];
};

enum Field {
  Author = "author",
  Category = "category",
  Channel = "channel",
  Cloud = "cloud",
  Copyright = "copyright",
  Description = "description",
  Docs = "docs",
  Enclosure = "enclosure",
  Generator = "generator",
  Guid = "guid",
  Height = "height",
  Image = "image",
  isPermaLink = "ispermalink",
  Item = "item",
  Language = "language",
  LastBuildDate = "lastbuilddate",
  Length = "length",
  Link = "link",
  ManagingEditor = "managingeditor",
  PubDate = "pubdate",
  SkipDays = "skipdays",
  SkipHours = "skiphours",
  Source = "source",
  TextInput = "textinput",
  Title = "title",
  Ttl = "ttl",
  Url = "url",
  WebMaster = "webmaster",
  Width = "width",
}
