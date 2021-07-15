import { FeedType } from "./feed-type.ts";

export interface Feed {
	version?: string;
	id: string;
	type: FeedType;
	title: TextField;
	description: string;
	generator?: string;
	language?: string;
	icon: string;
	links: string[];
	published?: Date;
	publishedRaw?: string;
	updateDate?: Date;
	updateDateRaw?: string;
	copyright?: string;
	author: Author;
	ttl?: number;
	categories: Category[];
	entries: FeedEntry[];
	skipHours?: number[];
	skipDays?: string[];
	webMasterMail?: string;
	managingEditorMail?: string;
}

export interface FeedEntry {
	title?: TextField;
	description?: TextField;
	summary?: string;
	link: string;
	id: string;
	author?: Author;
	creators?: string[];
	published: Date;
	publishedRaw: string;
	updated: Date;
	updatedRaw: string;
	categories?: Category[];
	content?: string;
	comments?: string;
	source?: {
		id: string;
		title: string;
		updated: Date;
		updatedRaw: Date;
	};
	contributors?: Person[];
	rights: TextField;
	attachments?: Attachment[];
}

interface Attachment {
	url?: string;
	mimeType?: string;
	sizeInBytes?: number;
}

interface TextField {
	type?: string | ContentType;
	value?: string;
}

interface Author {
	name?: string;
	email?: string;
	uri?: string;
	avatar?: string;
}

interface Category {
	term: string;
	label: string;
}

enum ContentType {
	Text = 'text',
	Html = 'html',
	XHtml = 'xhtml'
}

interface Person {
	name: string;
	email?: string;
	uri?: string;
}
