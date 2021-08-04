import type { Atom } from "./atom.ts";
import type { RSS1 } from "./rss1.ts";
import type { RSS2 } from "./rss2.ts";
import type { JsonFeed } from "./json-feed.ts";
import { FeedType } from "./feed-type.ts";

export interface DeserializationResult<
  T extends Atom | RSS1 | RSS2 | JsonFeed,
> {
  feed: T;
  feedType: T extends JsonFeed ? FeedType.JsonFeed
    : Exclude<FeedType, FeedType.JsonFeed>;
}
