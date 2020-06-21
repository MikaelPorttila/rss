# RSS
RSS parser lib for Deno

## Usage

``` typescript
import { parseRss } from 'https://unpkg.com/...';

const request = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const rss = await request.text();
const parsedFeed = await parseRss(rss); 

```

## Notes
- This lib provides a RSS Xml parser, it doesn't support file loading.

## Benchmark
Hardware: i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

|Date| RSS | ATOM |
|----|-----|------|
| 2020-06-20| 1.3092ms|- |
|2020-06-21 | 1.2322ms | 4.2792ms


