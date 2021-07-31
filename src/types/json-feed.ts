// https://github.com/manton/JSONFeed/blob/master/pages/version/1.markdown

export interface JsonFeed {
  version?: string;
  title: string;
  home_page_url?: string;
  feed_url?: string;
  description?: string;
  user_comment?: string;
  next_url?: string;
  icon?: string;
  favicon?: string;
  items: JsonFeedItem[];
  author?: JsonFeedAuthor;
  expired?: boolean;
  hubs?: JsonFeedHub[];
}

export interface JsonFeedItem {
  id: string;
  title?: string;
  content_text?: string;
  content_html?: string;
  url?: string;
  external_url?: string;
  date_published?: Date;
  date_publishedRaw?: string;
  summary?: string;
  image?: string;
  banner_image?: string;
  date_modified?: Date;
  date_modifiedRaw?: string;
  authors?: JsonFeedAuthor[];
  /**
	 * @deprecated Please use the new JsonFeed 1.1 authors field instead.
	 */
  author?: JsonFeedAuthor;
  tags?: string[];
  attachments?: Attachment[];
}

export interface JsonFeedAuthor {
  name?: string;
  url?: string;
  avatar?: string;
}

export interface JsonFeedHub {
  type: string;
  url: string;
}

interface Attachment {
  url: string;
  mime_type: string;
  title?: string;
  size_in_bytes?: number;
  duration_in_seconds?: number;
}
