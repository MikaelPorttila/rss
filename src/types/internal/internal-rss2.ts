// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements

import { InternalDublinCore } from "./internal-dublin-core.ts";
import { MediaRssValueFields } from "../media-rss.ts";
import { ValueField } from "../value-field.ts";

export interface InternalRSS2 {
  version: number;
  channel: Channel;
}

interface Channel extends InternalDublinCore {
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

interface Item extends InternalDublinCore, MediaRssValueFields {
  title?: ValueField<string>;
  description?: ValueField<string>;
  link?: ValueField<string>;
  author?: ValueField<string>;
  categories?: ValueField<string>[];
  comments?: ValueField<string>;
  enclosure?: Enclosure[];
  guid?: ValueField<string>;
  pubDate?: ValueField<Date>;
  pubDateRaw?: ValueField<string>;
  source?: Source;
}

interface Enclosure {
  url?: string;
  length?: number;
  type?: string;
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

interface Image extends InternalDublinCore {
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
