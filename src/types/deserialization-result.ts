import { Feed } from "./atom.ts"
import { FeedType } from './feed-type.ts';
import { JsonFeed } from "./json-feed.ts"
import { RSS1 } from "./rss1.ts"
import { RSS2 } from "./rss2.ts"

export interface DeserializationResult<T extends Feed | RSS1 | RSS2 | JsonFeed> {
	feed: T;
	feedType: T extends JsonFeed ? FeedType.JsonFeed : Exclude<FeedType, FeedType.JsonFeed>;
}
