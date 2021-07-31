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

| Feed                  | Atom      | RSS2                                                                  | RSS                                       |
| --------------------- | --------- | --------------------------------------------------------------------- | ----------------------------------------- |
| FeedType              | Atom      | RSS2                                                                  | RSS1                                      |
| Id                    | Id        | -                                                                     | -                                         |
| Title                 | Title     | Title or DC:Title                                                     | Title or DC:Title                         |
| Description           | Subtitle  | Description or DC:Description                                         | Description or DC:Description             |
| Links                 | Links     | Link, DC:URI                                                          | Link or DC:URI                            |
| Image                 | Logo      | Image                                                                 | Image                                     |
| Icon                  | Icon      | -                                                                     | -                                         |
| Language              | N/A       | Language or DC:Language                                               | DC:Language                               |
| Created               | Updated   | LastBuildDate or DC:Created or PubDate or DC:DateSubmitted or DC:Date | DC:Created or DC:DateSubmitted or DC:Date |
| Published             | Updated   | PubDate or DC:DateSubmitted or DC:Date                                | DC:DateSubmitted or DC:Date               |
| UpdateDate            | Updated   | LastBuildDate or DC:Date                                              | DC:Date                                   |
| Generator             | Generator | Generator                                                             | -                                         |
| Ttl                   | -         | Ttl                                                                   | -                                         |
| Categories            | Category  | -                                                                     | -                                         |
| Author                | Author    | WebMaster or DC:Creator                                               | DC:Creator                                |
| Copyright             | -         | Copyright or DC:Rights                                                | DC:Rights                                 |
| SkipDays              | -         | SkipDays                                                              | -                                         |
| SkipHours             | -         | SkipHours                                                             | -                                         |
| Docs                  | -         | Docs                                                                  | -                                         |
| Dublin Core Namespace | -         | All Dublin Core fields                                                | All Dublin Core fields                    |
| Slash Namespace       | -         | -                                                                     | All Slash fields                          |

### Entries/Items

| Feed                  | Atom                                          | RSS2                                   | RSS                           |
| --------------------- | --------------------------------------------- | -------------------------------------- | ----------------------------- |
| Id                    | Id                                            | Guid                                   | DC:URI or Link                |
| Author                | Author                                        | Author or DC:Creator                   | DC:Creator                    |
| Title                 | Title                                         | Title or DC:Title                      | Title or DC:Title             |
| Description           | Summary                                       | Description or DC:Description          | Description or DC:Description |
| Content               | Content                                       | -                                      | -                             |
| Links                 | Links, feedburner:origlink, Href, (Id if URL) | Href                                   | Link, DC:URI                  |
| Attachments           | Links (marked as enclosure)                   | Enclosure                              | -                             |
| Published             | Published                                     | DC:DateSubmitted or PubDate or DC:date | DC:DateSubmitted or DC:Date   |
| Updated               | Updated                                       | PubDate                                | DC:DateSubmitted or DC:Date   |
| Categories            | Category                                      | Category                               | -                             |
| Contributors          | Contributors                                  | DC:Contributor                         | DC:Contributor                |
| Comments              | -                                             | Comments                               | -                             |
| Source                | Source                                        | -                                      | -                             |
| Media Namespace       | -                                             | All Media fields                       | -                             |
| Dublin Core Namespace | -                                             | All Dublin Core fields                 | All Dublin Core fields        |
| Slash Namespace       | -                                             | -                                      | All Slash fields              |
