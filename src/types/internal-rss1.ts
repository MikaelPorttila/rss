import { DublinCoreValueFields } from "./dublin-core.ts";
import { SlashValueFields } from "./slash.ts";
import { ValueField } from "./value-field.ts";

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

interface Channel extends DublinCoreValueFields {
  title: ValueField<string>;
  link: ValueField<string>;
  description: ValueField<string>;
  about: ValueField<string>; // Mapped rdf:about
}

interface Item extends DublinCoreValueFields, SlashValueFields {
  title: ValueField<string>;
  link: ValueField<string>;
  description: ValueField<string>;
}

interface Image extends DublinCoreValueFields {
  about: string;
  resource: string;
  title: ValueField<string>;
  link: ValueField<string>;
  url: ValueField<string>;
}
