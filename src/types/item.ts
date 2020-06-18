import { Enclosure } from "./enclosure.ts";
import { Source } from "./source.ts";

export interface Item {
  title: string;
  link: string;
  description: string;
  author: string;
  category: string;
  comments: string;
  enclosure?: Enclosure;
  guid?: string;
  pubDate?: Date;
  source?: Source;
}
