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

## Parsed feed object type

Opinionated type definition which RSS and Atom are mapped into.

This is a readable copy of the real type definition, Please check **feed.ts**
for the actual defintion.

```typescript
{
	version?: string;
	id: string;
	type: FeedType;
	title: {
		type?: string | ContentType;
		value: string;
	};
	description?: string;
	generator?: string;
	language?: string;
	icon?: string;
	links: string[];
	publishedRaw?: string;
	updateDate?: Date;
	updateDateRaw?: string;
	copyright?: string;
	author: {
		name?: string;
		email?: string;
		uri?: string;
		avatar?: string;
	};
	ttl?: number;
	categories: [{
		term: string;
		label: string;
	}];
	skipHours?: number[];
	skipDays?: string[];
	webMasterMail?: string;
	managingEditorMail?: string;
	image?: {
		url: string;
		title: string;
		link: string;
		width?: number;
		height?: number;
	};
	entries: [{
		title?: {
			type?: string | ContentType;
			value: string;
		};
		description?: {
			type?: string | ContentType;
			value: string;
		};
		summary?: string;
		link: string;
		id: string;
		author?: {
			name?: string;
			email?: string;
			uri?: string;
			avatar?: string;
		};
		creators?: string[];
		published: Date;
		publishedRaw: string;
		updated: Date;
		updatedRaw: string;
		categories?: [{
			term: string;
			label: string;
		}];
		content?: string;
		comments?: string;
		source?: {
			id: string;
			title: string;
			updated: Date;
			updatedRaw: Date;
		};
		contributors?: [{
			name: string;
			email?: string;
			uri?: string;
		}];
		rights: {
			type?: string | ContentType;
			value?: string;
		};
		attachments?: [{
			url?: string;
			mimeType?: string;
			sizeInBytes?: number;
		}];
		mediaContent?: {
			url?: string;
			width?: number;
			height?: number;
			medium?: string;
		};
		mediaCredit?: string;
		mediaDescription?: string;
	}];
}
```

## Benchmark

Hardware: Intel i7-9750H 2.60GHz, 32GB 2667 MHz.

Rounds: 10000

| Release | ATOM (4KB sample) | RSS 2.0 (4 KB sample) | RSS 1.0 (3 KB sample) |
| ------- | ----------------- | --------------------- | --------------------- |
| 0.1     | 0.454ms           | 0.490ms               | 0.182ms               |
