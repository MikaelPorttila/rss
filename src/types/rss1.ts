// https://validator.w3.org/feed/docs/rss1.html
export interface RSS1 {
	channel: {
		title: string;
		link: string;
		description: string;
		about: string; // Mapped rdf:about
		image: {
			about: string; // Mapped rdf:about
			resource: string;
			title: string;
			link: string;
			url: string;
		};
		items: {
			title: string;
			link: string;
			description: string;
		}[];
		textInput: {
			title: string;
			description: string;
			name: string;
			link: string;
			about: string; //Mapped from rdf:about
		};
	};
}
