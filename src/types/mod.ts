export * from "./rss1.ts";
export * from "./rss2.ts";
export * from "./atom.ts";
export * from "./json-feed.ts";

export enum FeedParseType {
  Atom = "feed",
  Rss1 = "rdf:rdf",
  Rss2 = "rss",
}

export enum FeedType {
  Atom = "ATOM",
  JsonFeed = "JSON Feed",
  Rss1 = "RSS 1.0",
  Rss2 = "RSS 2.0",
}
