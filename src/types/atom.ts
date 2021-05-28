// https://validator.w3.org/feed/docs/atom.html

export interface Feed {
	id: string;
	title: Text;
	updated: Date;
	icon?: string;
	links?: Link[];
	entries: Entry[];
	categories?: Category[];
	contributors?: Person[];
	generator?: string;
	author?: Person;
	logo?: string;
	rights?: Text;
	subtitle?: Text;
}

interface Link {
	type: string;
	href: string;
	rel: string;
	length?: number
}

interface Category {
	term: string;
	label?: string;
}

interface Entry {
	id: string;
	title: Text;
	updated: Date;
	published?: Date;
	content?: Content;
	links?: Link[];
	author?: Person;
	contributors?: Person[];
	summary?: Text;
	rights?: Text;
	categories?: string[];
	source?: Source;
	href?: string;
	[key: string]: any;
}

interface Content extends Text {
	src?: string;
}

interface Person {
	name: string;
	email?: string;
	uri?: string;
}

interface Source {
	id?: string;
	title?: string;
	updated?: Date;
}

interface Text {
	type: string;
	value: string;
}
