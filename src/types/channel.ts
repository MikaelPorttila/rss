import { Image } from "./image.ts";
import { Cloud } from "./cloud.ts";
import { Item } from "./item.ts";

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
