![CI](https://github.com/MikaelPorttila/rss/workflows/CI/badge.svg?branch=master)
[![tag](https://img.shields.io/github/tag/MikaelPorttila/rss.svg)](https://github.com/MikaelPorttila/rss/releases)

## About
RSS / ATOM Deserialization module for Deno.<br/>The project aims to provide a lightweight and easy-to-use feed deserializer with the option to output JSON Feed.

[Check out the deserializer in this online showcase](https://repl.it/@MikaelPorttila/Deno-RSS-Module)

## Usage

``` typescript
import { deserializeFeed } from 'https://deno.land/x/rss/mod.ts';

const response = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const xml = await response.text();
const { feed, feedType } = await deserializeFeed(xml);

switch(feedType) {
	case FeedType.Rss2:
		// Your code...
	break;
}
```

Convert feed to JSON Feed:
``` typescript
import { deserializeFeed } from 'https://deno.land/x/rss/mod.ts';

const response = await fetch('http://static.userland.com/gems/backend/rssTwoExample2.xml');
const xml = await response.text();
const { feed } = await deserializeFeed(xml, { outputJsonFeed: true });

// Your code...
```

## Benchmark
Hardware: Intel i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

| Release | ATOM (4KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
|---------|-------------------|-----------------------|-----------------------|
| 0.1     | 0.454ms           | 0.490ms               | 0.182ms               |
