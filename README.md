![CI](https://github.com/MikaelPorttila/rss/workflows/CI/badge.svg?branch=master)

## About
RSS Parser module for Deno.
The project aims to provide a lightweight feed parser which supports both RSS and ATOM.

## Usage

``` typescript
import { 
    parseRss, 
    FeedType, 
    Feed, 
    RSS2, 
    RSS1, 
    toJsonFeed 
} from 'https://raw.githubusercontent.com/MikaelPorttila/rss/master/mod.ts';

const response = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const xml = await response.text();

// Usage option 1:
const [feedType, feed] = await parseRss(xml);

switch(feedType) {
    case FeedType.Atom:
        const atomFeed = feed as Feed;
        // ... your code 
        breka;
    case FeedType.RSS2:
        const rss2Feed = feed as RSS2;
        // ... your code
        break;
    case FeedType.RSS1:
        const rss1Feed = feed as RSS1;
        // ... your code
        break;
}

// Usage option 2: Let the parser convert the feed into JSON Feed 1.0
const [feedType, jsonFeed] = await parseRss(xml, { outputJsonFeed: true });

```

## Benchmark
Hardware: i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

| Release | ATOM (4KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
|---------|-------------------|-----------------------|-----------------------|
| 0.1     | 0.454ms           | 0.490ms               | 0.182ms               |

