export type {
  Atom,
  DeserializationResult,
  Feed,
  JsonFeed,
  RSS1,
  RSS2,
} from "./src/types/mod.ts";

export {
  DublinCoreFields as DublinCore,
  FeedType,
  MediaRssFields as MediaRss,
  SlashFields as Slash,
} from "./src/types/mod.ts";

export type { Options } from "./src/deserializer.ts";

export { deserializeFeed, parseFeed } from "./src/deserializer.ts";
