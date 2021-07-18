import { DublinCore } from "./dublin-core.ts";
import { FeedType } from "./feed-type.ts";

export interface Feed {
	version?: string;
	id: string;
	type: FeedType;
	title: TextField;
	description?: string;
	generator?: string;
	language?: string;
	icon?: string;
	links: string[];
	created?: Date;
	createdRaw?: string;
	published?: Date;
	publishedRaw?: string;
	updateDate?: Date;
	updateDateRaw?: string;
	copyright?: string;
	author: Author;
	ttl?: number;
	categories: Category[];
	skipHours?: number[];
	skipDays?: string[];
	webMasterMail?: string;
	managingEditorMail?: string;
	image?: FeedImage;
	entries: FeedEntry[];
	dc: DublinCore;
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
	mediaContent?: FeedMedia;
	mediaCredit?: string;
	mediaDescription?: string;
	dc: DublinCore;
}

interface FeedImage {
	url: string;
	title: string;
	link: string;
	width?: number;
	height?: number;
}

interface Attachment {
	url?: string;
	mimeType?: string;
	sizeInBytes?: number;
}

interface FeedMedia {
	url?: string;
	width?: number;
	height?: number;
	medium?: string;
}

interface TextField {
	type?: string | ContentType;
	value?: string;
}

interface Author extends Person {
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
