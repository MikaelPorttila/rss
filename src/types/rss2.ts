// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements

import { DublinCore } from "./dublin-core.ts";
import { MediaRss } from "./media-rss.ts";

export interface RSS2 {
  version: number;
  channel: Rss2Channel;
}

export interface Rss2Channel extends DublinCore {
  title: string;
  link: string;
  description: string;
  items: Rss2Item[];
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  pubDate?: Date;
  pubDateRaw?: string;
  lastBuildDate?: Date;
  lastBuildDateRaw?: string;
  category?: string[];
  generator?: string;
  docs?: string;
  cloud?: Cloud;
  ttl?: number;
  image?: Image;
  textInput?: any; // TODO: Fix
  skipHours?: {
    hour?: number[];
  };
  skipDays?: {
    day?: string[];
  };
}

export interface Rss2Item extends DublinCore, MediaRss {
  title?: string;
  description?: string;
  link?: string;
  author?: string;
  categories?: string[];
  comments?: string;
  enclosure?: Enclosure;
  guid?: string;
  pubDate?: Date;
  pubDateRaw?: string;
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
  domain?: string;
  port?: number;
  path?: string;
  registerProcedure?: string;
  protocol?: string;
}

interface Image extends DublinCore {
  url?: string;
  title?: string;
  link?: string;
  width?: number;
  height?: number;
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
