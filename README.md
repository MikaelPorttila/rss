![CI](https://github.com/MikaelPorttila/rss/workflows/CI/badge.svg?branch=master)

## About
RSS / ATOM Deserialization module for Deno.
The project aims to provide a lightweight and easy-to-use feed deserializer with the option to output JSON Feed 1.0.

## Usage

``` typescript
import { 
    deserializeFeed,
    FeedType,
    Feed,
    RSS2,
    Jsonfeed
} from 'https://raw.githubusercontent.com/MikaelPorttila/rss/master/mod.ts';

const response = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const xml = await response.text();

const [feedType, feed] = await deserializeFeed(xml, { outputJsonFeed: true });

switch(feedType) {
    case FeedType.Atom:
        const atomFeed = feed as Feed;
        // ... your code 
        breka;
    case FeedType.RSS2:
        const rss2Feed = feed as RSS2;
        // ... your code
        break;
    case FeedType.Jsonfeed:
        const jsonFeed = feed as JsonFeed;
        // ... your code
        break;
}

```

## Benchmark
Hardware: i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

| Release | ATOM (4KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
|---------|-------------------|-----------------------|-----------------------|
| 0.1     | 0.454ms           | 0.490ms               | 0.182ms               |

