export * from "./rss1.ts";
export * from "./rss2.ts";
export * from "./atom.ts";
export * from "./json-feed.ts";

export enum FeedParseType {
  Rss2 = "rss",
  Rss1 = "rdf:rdf",
  Atom = "feed",
}

export enum FeedType {
  Rss2 = "RSS 2.0",
  Rss1 = "RSS 1.0",
  Atom = "ATOM",
  JsonFeed = "JSON Feed"
}
