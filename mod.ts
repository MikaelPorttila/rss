export type {
  DeserializationResult,
  Feed,
  JsonFeed,
  RSS1,
  RSS2,
	Atom
} from "./src/types/mod.ts";

export {
  DublinCoreFields as DublinCore,
  FeedType,
  MediaRssFields as MediaRss,
} from "./src/types/mod.ts";

export type { Options } from "./src/deserializer.ts";

export { deserializeFeed, parseFeed } from "./src/deserializer.ts";
