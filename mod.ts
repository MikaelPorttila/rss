export type {
  DeserializationResult,
  Feed,
  JsonFeed,
  RSS1,
  RSS2
} from "./src/types/mod.ts";

export type {
	Atom
} from './src/types/atom.ts';

export type {
  DublinCoreFields as DublinCore,
  FeedType,
  MediaRssFields as MediaRss,
} from "./src/types/mod.ts";

export type { Options } from "./src/deserializer.ts";

export { deserializeFeed, parseFeed } from "./src/deserializer.ts";
