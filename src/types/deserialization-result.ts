import { Feed } from "./atom.ts"
import { JsonFeed } from "./json-feed.ts"
import { RSS1 } from "./rss1.ts"
import { RSS2 } from "./rss2.ts"
import { FeedType } from './feed-type.ts';

export class DeserializationResult<T extends Feed | RSS1 | RSS2 | JsonFeed> {
	constructor(
		public feed: T,
		public feedType: FeedType
	) {}
}
