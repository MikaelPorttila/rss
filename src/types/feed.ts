import { DublinCore } from "./dublin-core.ts";
import { Slash } from './slash.ts';
import { FeedType } from "./feed-type.ts";

export interface Feed {
  version?: string;
  id: string;
  type: FeedType;
  title: TextField;
  description?: string;
  generator?: string;
  language?: string;
  icon?: string;
  links: string[];
  created?: Date;
  createdRaw?: string;
  published?: Date;
  publishedRaw?: string;
  updateDate?: Date;
  updateDateRaw?: string;
  copyright?: string;
  author: Author;
  ttl?: number;
  categories: Category[];
  skipHours?: number[];
  skipDays?: string[];
  image?: FeedImage;
  docs?: string;
  entries: FeedEntry[];
  dc: DublinCore;
}

export interface FeedEntry {
  title?: TextField;
  description?: TextField;
  links: Link[];
  id: string;
  author?: Author;
  published?: Date;
  publishedRaw?: string;
  updated?: Date;
  updatedRaw?: string;
  categories?: Category[];
  content?: TextField;
  comments?: string;
  source?: {
    id?: string;
    title?: string;
    updated?: Date;
    updatedRaw?: Date;
		url?: string
  };
  contributors?: Person[];
  rights: TextField;
  attachments?: Attachment[];
  mediaContent?: FeedMedia;
  mediaCredit?: string;
  mediaDescription?: string;
  dc: DublinCore;
	slash: Slash;
}

interface FeedImage {
  url: string;
  title: string;
  link: string;
  width?: number;
  height?: number;
}

interface Attachment {
  url?: string;
  mimeType?: string;
  sizeInBytes?: number;
}

interface FeedMedia {
  url?: string;
  width?: number;
  height?: number;
  medium?: string;
}

interface Link {
	rel?: string;
	type?: string;
	href?: string;
	title?: string;
}

interface TextField {
  type?: string | ContentType;
  value?: string;
}

interface Author extends Person {
  avatar?: string;
}

interface Category {
  term: string;
  label: string;
}

enum ContentType {
  Text = "text",
  Html = "html",
  XHtml = "xhtml",
}

interface Person {
  name?: string;
  email?: string;
  uri?: string;
}
