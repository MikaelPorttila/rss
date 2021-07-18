import { DublinCore } from "./dublin-core.ts";

// https://validator.w3.org/feed/docs/rss1.html
export interface RSS1 {
  channel: Channel;
}

interface Channel extends DublinCore {
	title: string;
	link: string;
	description: string;
	about: string; // Mapped rdf:about
	image: Image;
	items: Item[];
	textInput: {
		title: string;
		description: string;
		name: string;
		link: string;
		about: string; //Mapped from rdf:about
	};
}

interface Item extends DublinCore {
	title: string;
	link: string;
	description: string;
}

interface Image extends DublinCore {
	about: string;
	resource: string;
	title: string;
	link: string;
	url: string;
}
