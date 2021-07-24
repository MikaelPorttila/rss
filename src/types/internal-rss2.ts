// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements

import { DublinCore } from "./dublin-core.ts";
import { ValueField } from "./value-field.ts";

export interface InternalRSS2 {
  version: number;
  channel: Channel;
}

interface Channel extends DublinCore {
  title: ValueField<string>;
  link: ValueField<string>;
  description: ValueField<string>;
  language?: ValueField<string>;
  copyright?: ValueField<string>;
  managingEditor?: ValueField<string>;
  webMaster?: ValueField<string>;
  pubDate?: ValueField<Date>;
  pubDateRaw?: ValueField<string>;
  lastBuildDate?: ValueField<Date>;
  lastBuildDateRaw?: ValueField<string>;
  category?: [ValueField<string>];
  generator?: ValueField<string>;
  docs?: ValueField<string>;
  cloud?: Cloud;
  ttl?: ValueField<number>;
  image?: Image;
  textInput?: any; // TODO: Fix
  skipHours?: {
    hour?: ValueField<number>[];
  };
  skipDays?: {
    day?: ValueField<string>[];
  };
	items: Item[];
}

interface Item extends DublinCore {
  title?: ValueField<string>;
  description?: ValueField<string>;
  link?: ValueField<string>;
  author?: ValueField<string>;
  categories?: ValueField<string>[];
  comments?: ValueField<string>;
  enclosure?: Enclosure;
  guid?: ValueField<string>;
  pubDate?: ValueField<Date>;
  pubDateRaw?: ValueField<string>;
  source?: Source;
  "media:content"?: {
    width?: number;
    height?: number;
    medium?: string;
    url?: string;
  };
  "media:credit"?: ValueField<string>;
  "media:description"?: ValueField<string>;
}

interface Enclosure {
  url: ValueField<string>;
  length: ValueField<number>;
  type: ValueField<string>;
}

interface Source {
  title: string;
  url: string;
}

interface Cloud {
  domain?: ValueField<string>;
  port?: ValueField<number>;
  path?: ValueField<string>;
  registerProcedure?: ValueField<string>;
  protocol?: ValueField<string>;
}

interface Image extends DublinCore {
  url: ValueField<string>;
  title: ValueField<string>;
  link: ValueField<string>;
  width?: ValueField<number>;
  height?: ValueField<number>;
}

enum Days {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}
