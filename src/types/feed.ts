import { FeedType } from "./feed-type.ts";

export interface Feed {
	version?: string,
	type: FeedType,
	title: TextField,
	description: string,
	id: string,
	generator: string,
	icon: string,
	links: string[],
	published?: Date,
	publishedRaw?: string,
	updateDate?: Date,
	updateDateRaw?: string,
	copyright?: string,
	author: Author
	ttl?: number,
	categories: Category[],
	entries: FeedEntry[]
}

export interface FeedEntry {
	title?: TextField,
	description?: TextField,
	summary?: string,
	link: string,
	id: string;
	author?: Author,
	creators?: string[]
	published: Date,
	publishedRaw: string,
	categories?: Category[],
	content?: string,
	source: {
		id: string,
		title: string,
		updated: Date,
		updatedRaw: Date,
	},
	contributor: string[],
	rights: TextField,
	attachments?: Attachment[]
}

interface Attachment {
	url?: string,
	mimeType?: string,
	sizeInBytes?: number
}

interface TextField {
	type?: string,
	value?: string
}

interface Author {
	name?: string,
	email?: string,
	uri?: string,
	avatar?: string
}

interface Category {
	term: string;
}
