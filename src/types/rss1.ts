import type { DublinCore } from "./dublin_core.ts";
import type { Slash } from "./slash.ts";

// https://validator.w3.org/feed/docs/rss1.html
export interface RSS1 {
  channel: Channel;
  image: Image;
  textInput: {
    about: string; //Mapped from rdf:about
    title: string;
    description: string;
    link: string;
    name: string;
  };
  item: Item[];
}

interface Channel extends DublinCore {
  about: string; // Mapped rdf:about
  title: string;
  link: string;
  description: string;
}

interface Item extends DublinCore, Slash {
  title: string;
  link: string;
  description: string;
}

interface Image extends DublinCore {
  about: string;
  title: string;
  resource: string;
  link: string;
  url: string;
}
