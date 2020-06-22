# RSS
RSS parser lib for Deno

## Usage

``` typescript
import { parseRss } from 'https://unpkg.com/...';

const request = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const rss = await request.text();
const [feedType, result] = await parseRss(rss);

```

## Notes
- This lib provides a RSS Xml parser, it doesn't support file loading.

## Benchmark
Hardware: i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

|Date | ATOM (2KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
|-|-|-|-|
| 2020-06-22| 0.193ms| 0.525ms | 0.1912ms

