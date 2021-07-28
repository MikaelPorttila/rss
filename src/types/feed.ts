import { DublinCore } from "./dublin-core.ts";
import { Slash } from './slash.ts';
import { FeedType } from "./feed-type.ts";
import { MediaRss } from "./media-rss.ts";

export interface Feed extends DublinCore  {
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
  author?: Author;
  ttl?: number;
  categories: Category[];
  skipHours?: number[];
  skipDays?: string[];
  image?: FeedImage;
  docs?: string;
  entries: FeedEntry[];
}

export interface FeedEntry extends DublinCore, Slash, MediaRss {
  title?: TextField;
  description?: TextField;
  links: Link[];
  id: string;
  author?: Author; // Todo, lets go with authors instead
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
    updatedRaw?: string;
		url?: string
  };
  contributors?: Person[];
  rights: TextField;
  attachments?: Attachment[];
}

interface FeedImage {
  url?: string;
  title?: string;
  link?: string;
  width?: number;
  height?: number;
}

interface Attachment {
  url?: string;
  mimeType?: string;
  sizeInBytes?: number;
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
  term?: string;
  label?: string;
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
