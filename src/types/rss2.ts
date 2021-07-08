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
	lastBuildDate?: Date;
	category?: string[];
	generator?: string;
	docs?: string;
	cloud?: Cloud;
	ttl?: number;
	image?: Image;
	textInput?: any; // TODO: Fix
	skipHours?: number;
	skipDays?: Days;
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
	source?: Source;
	'dc:creator'?: string[];
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
