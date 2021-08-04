import type { InternalDublinCore } from "./internal_dublin_core.ts";
import type { SlashValueFields } from "../slash.ts";
import type { ValueField } from "../value_field.ts";

// https://validator.w3.org/feed/docs/rss1.html
export interface InternalRSS1 {
  channel: Channel;
  item: Item[];
  image: Image;
  textInput: {
    title: ValueField<string>;
    description: ValueField<string>;
    name: ValueField<string>;
    link: ValueField<string>;
    about: string; //Mapped from rdf:about
  };
}

interface Channel extends InternalDublinCore {
  title: ValueField<string>;
  link: ValueField<string>;
  description: ValueField<string>;
  about: ValueField<string>; // Mapped rdf:about
}

interface Item extends InternalDublinCore, SlashValueFields {
  title: ValueField<string>;
  link: ValueField<string>;
  description: ValueField<string>;
}

interface Image extends InternalDublinCore {
  about: string;
  resource: string;
  title: ValueField<string>;
  link: ValueField<string>;
  url: ValueField<string>;
}
