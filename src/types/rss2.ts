// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements

import { DublinCore } from "./dublin-core.ts";

export interface RSS2 {
	version: number;
	channel: Channel;
}

interface Channel extends DublinCore {
	title: string;
	link: string;
	description: string;
	items: Item[];
	language?: string;
	copyright?: string;
	managingEditor?: string;
	webMaster?: string;
	pubDate?: Date;
	pubDateRaw?: string;
	lastBuildDate?: Date;
	lastBuildDateRaw?: string;
	category?: string[];
	generator?: string;
	docs?: string;
	cloud?: Cloud;
	ttl?: number;
	image?: Image;
	textInput?: any; // TODO: Fix
	skipHours?: {
		hour?: number[];
	};
	skipDays?: {
		day?: string[];
	};
}

interface Item extends DublinCore {
	title?: string;
	description?: string;
	link?: string;
	author?: string;
	categories?: string[];
	comments?: string;
	enclosure?: Enclosure;
	guid?: string;
	pubDate?: Date;
	pubDateRaw?: string;
	source?: Source;
	'media:content'?: {
		width?: number;
		height?: number;
		medium?: string;
		url?: string;
	};
	'media:credit'?: string;
	'media:description'?: string;
}

interface Enclosure {
	url: string;
	length: number;
	type: string;
}

interface Source {
	title: string;
	url: string;
}

interface Cloud {
	domain?: string;
	port?: number;
	path?: string;
	registerProcedure?: string;
	protocol?: string;
}

interface Image extends DublinCore {
	url: string;
	title: string;
	link: string;
	width?: number;
	height?: number;
}

enum Days {
	Monday = "Monday",
	Tuesday = "Tuesday",
	Wednesday = "Wednesday",
	Thursday = "Thursday",
	Friday = "Friday",
	Saturday = "Saturday",
	Sunday = "Sunday",
}
