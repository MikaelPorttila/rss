export type {
  Atom,
  DeserializationResult,
  Feed,
  JsonFeed,
  RSS1,
  RSS2,
} from "./src/types/mod.ts";

export {
	FeedType,
	DublinCoreFields as DublinCore,
	MediaRssFields as MediaRss
} from "./src/types/mod.ts";

export type { Options } from "./src/deserializer.ts";

export { deserializeFeed, parseFeed } from "./src/deserializer.ts";
