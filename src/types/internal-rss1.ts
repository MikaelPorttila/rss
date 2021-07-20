import { DublinCore } from "./dublin-core.ts";
import { ValueField } from "./value-field.ts";

// https://validator.w3.org/feed/docs/rss1.html
export interface InternalRSS1 {
  channel: Channel;
}

interface Channel extends DublinCore {
	title: ValueField<string>;
	link: ValueField<string>;
	description: ValueField<string>;
	about: ValueField<string>; // Mapped rdf:about
	image: Image;
	item: Item[];
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
	title: ValueField<string>;
	link: ValueField<string>;
	description: ValueField<string>;
}

interface Image extends DublinCore {
	about: string;
	resource: string;
	title: ValueField<string>;
	link: ValueField<string>;
	url: ValueField<string>;
}
