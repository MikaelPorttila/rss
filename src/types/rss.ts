// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements
export interface Channel {
  title: string;
  link: string;
  description: string;
  items: Item[];
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  pubDate?: Date;
  lastBuildDate?: Date;
  category?: string[];
  generator?: string;
  docs?: string;
  cloud?: Cloud;
  ttl?: number;
  image?: Image;
  textInput?: any; // TODO: Fix
  skipHours?: number;
  skipDays?:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
}

export interface Item {
  title: string;
  link: string;
  description: string;
  author: string;
  categories: string[];
  comments: string;
  enclosure?: Enclosure;
  guid?: string;
  pubDate?: Date;
  source?: Source;
}

// https://validator.w3.org/feed/docs/rss2.html#ltsourcegtSubelementOfLtitemgt
export interface Source {
  title: string;
  url: string;
}

// https://validator.w3.org/feed/docs/rss2.html#ltimagegtSubelementOfLtchannelgt
export interface Image {
  url: string;
  title: string;
  link: string;
  width?: number;
  height?: number;
}

// https://validator.w3.org/feed/docs/rss2.html#ltcloudgtSubelementOfLtchannelgt
export interface Cloud {
}

//https://validator.w3.org/feed/docs/rss2.html#ltenclosuregtSubelementOfLtitemgt
export interface Enclosure {
  url: string;
  length: number;
  type: string;
}

export enum Field {
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
