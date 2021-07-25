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

## Mapping Table

### Feed

| Feed | Atom | RSS2 | RSS |
|------|------|------|-----|
| FeedType | Atom | RSS2 | RSS1 |
| Id | Id | - | - |
| Title | Title | Title or dc:title | Title or dc:title |
| Description | Subtitle | Description or dc:description | Description or dc:description |
| Links | Links | Link, dc:URI | Link or dc:URI |
| Image | Logo | Image | Image |
| Icon | Icon | - | - |
| Language | N/A | Language or dc:language | dc:language |
| Created | Updated |  LastBuildDate or dc:created or PubDate or dc:dateSubmitted or dc:date | dc:created or dc:dateSubmitted or dc:date |
| Published | Updated | PubDate or dc:dateSubmitted or dc:date | dc:dateSubmitted or dc:date |
| UpdateDate | Updated | LastBuildDate or dc:date | dc:date  |
| Generator | Generator | Generator | - |
| Ttl | - | Ttl | - |
| Categories | Category | - | - |
| Author | Author | WebMaster | - |
| Copyright | - | Copyright or dc:rights | dc:rights |
| SkipDays | - | SkipDays | - |
| SkipHours | - |SkipHours | - |
| WebMasterMail | - | WebMaster | - |
| ManagingEditorMail | - | ManagingEditor | - |
| Docs | - | Docs | - |
| dc (Dublin Core Namespace) | - | All Dublin Core fields | All Dublin Core fields  |
| Slash | - | - | All Slash fields |

### Entries/Items

| Feed | Atom | RSS2 | RSS |
|------|------|------|-----|
| Id | Id | Guid | dc:URI or Link |
| Author | Author | Author | - |
| Title | Title | Title | Title or dc:title |
| Description | Summary | Description | Description or dc:description |
| Content | Content | - | -|
| Links | Links, feedburner:origlink, Href,  (Id if URL) | Href | Link, dc:URI |
| Attachments | Links (marked as enclosure) | - | - |
| Published | Published | dc:dateSubmitted or PubDate or dc:date | dc:dateSubmitted or dc:date |
| Updated | Updated | PubDate | - |
| Categories | Category | Category | - |
| Contributors | Contributors | - | - |
| Comments | - | Comments | - |
| MediaCredit | - | media:credit | - |
| MediaDescription | - | media:description | - |
| MediaContent | - | media:content | - |
| Source | Source | - | - |
| dc (Dublin Core Namespace) | - | All Dublin Core fields | All Dublin Core fields |
| Slash | - | - | All Slash fields |


## Benchmark

Hardware: Intel i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

| Release | ATOM (4KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
| ------- | ----------------- | --------------------- | --------------------- |
| 0.1     | 0.454ms           | 0.490ms               | 0.182ms               |
