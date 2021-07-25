![CI](https://github.com/MikaelPorttila/rss/workflows/CI/badge.svg?branch=master)
[![tag](https://img.shields.io/github/tag/MikaelPorttila/rss.svg)](https://github.com/MikaelPorttila/rss/releases)

## About

RSS and Atom deserialization module for Deno.<br/>The project aims to provide a
lightweight and easy-to-use feed deserializer.

[Check out the deserializer in this online
showcase](https://repl.it/@MikaelPorttila/Deno-RSS-Module)

## Usage

Download and parse feed:

```typescript
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

const response = await fetch(
  "http://static.userland.com/gems/backend/rssTwoExample2.xml",
);
const xml = await response.text();
const { feed } = await parseFeed(xml);

// Your code...
```

## Mapping

### Feed

| Feed | Atom | RSS2 | RSS |
|------|------|------|-----|
| FeedType | Atom | RSS2 | RSS1 |
| Id | Id | N/A | N/A |
| Title | Title | Title or dc:title | Title or dc:title |
| Description | Subtitle | Description or dc:description | Description or dc:description |
| Links | Links | Link, dc:URI | Link or dc:URI |
| Image | Logo | Image | Image |
| Icon | Icon | N/A | N/A |
| Language | N/A | Language or dc:language | dc:language |
| Created | Updated |  LastBuildDate or dc:created or PubDate or dc:dateSubmitted | N/A |
| Published | Updated | PubDate or dc:dateSubmitted | N/A |
| UpdateDate | Updated | LastBuildDate | N/A |
| Generator | Generator | Generator | N/A |
| Ttl | N/A | Ttl | N/A |
| Categories | Category | N/A | N/A |
| Author | Author | WebMaster | N/A |
| Copyright | N/A | Copyright | N/A |
| SkipDays | N/A | SkipDays | N/A |
| SkipHours | N/A |SkipHours | N/A |
| WebMasterMail | N/A | WebMaster | N/A |
| ManagingEditorMail | N/A | ManagingEditor | N/A |
| Docs | N/A | Docs | N/A |
| dc (Dublin Core Namespace) | N/A | All Dublin Core fields | All Dublin Core fields  |
| Slash | N/A | N/A | All Slash fields |

### Entries/Items

| Feed | Atom | RSS2 | RSS |
|------|------|------|-----|
| Id | Id | Guid | dc:URI or Link |
| Title | Title | Title | Title or dc:title |
| Description | Summary | Description | Description or dc:description |
| Content | Content | N/A | N/A |
| Attachments | Links (marked as enclosure) | N/A | N/A |
| Links | Links, feedburner:origlink, href,  (Id if URL) | Href | Link, dc:URI |
| Published | Published | dc:dateSubmitted or PubDate | N/A |
| Updated | Updated | PubDate | N/A |
| Comments | N/A | Comments | N/A |
| Contributors | Contributors | N/A | N/A |
| Categories | Category | Category | N/A |
| Author | Author | N/A | N/A |
| MediaCredit | N/A | media:credit | N/A |
| MediaDescription | N/A | media:description | N/A |
| MediaContent | N/A | media:content | N/A |
| Source | Source | N/A | N/A |
| dc (Dublin Core Namespace) | N/A | All Dublin Core fields | All Dublin Core fields |
| Slash | N/A | N/A | All Slash fields |


## Benchmark

Hardware: Intel i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

| Release | ATOM (4KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
| ------- | ----------------- | --------------------- | --------------------- |
| 0.1     | 0.454ms           | 0.490ms               | 0.182ms               |
