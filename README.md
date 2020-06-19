# rss
RSS parser lib for Deno

## Usage

``` typescript
import { parseRss } from 'https://unpkg.com/...';

const request = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const rss = await request.text();
const parsedFeed = await parseRss(ress); 

```

## Notes
- This lib only provides a parser, it doesn't support file loading.
