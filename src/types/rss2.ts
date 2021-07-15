// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements

export interface RSS2 {
	version: number;
	channel: Channel;
}

interface Channel {
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

interface Item {
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
	'dc:creator'?: string[];
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

interface Image {
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
