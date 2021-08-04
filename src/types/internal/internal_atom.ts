import type { ValueField } from "./../value_field.ts";
import { AtomFields } from "../fields/mod.ts";

export interface InternalAtom {
  id: ValueField<string>;
  title: Text;
  updated: ValueField<Date>;
  updatedRaw: ValueField<string>;
  icon?: ValueField<string>;
  links?: Link[];
  categories?: Category[];
  contributors?: Person[];
  generator?: ValueField<string>;
  author?: Person;
  logo?: ValueField<string>;
  rights?: Text;
  subtitle?: ValueField<string>;
  entries: Entry[];
}

interface Link {
  type: string;
  href: string;
  rel: string;
  length?: number;
}

interface Category {
  term: string;
  label?: string;
}

interface Entry {
  id: ValueField<string>;
  title: Text;
  updated: ValueField<Date>;
  updatedRaw: ValueField<string>;
  published?: ValueField<Date>;
  publishedRaw?: ValueField<string>;
  content?: Content;
  links?: Link[];
  author?: Person;
  contributors?: Person[];
  summary?: Text;
  rights?: Text;
  categories?: Category[];
  source?: Source;
  href?: string;
  [AtomFields.FeedburnerOrigLink]?: ValueField<string>;
}

interface Content extends Text {
  src?: string;
}

interface Person {
  name: ValueField<string>;
  email?: ValueField<string>;
  uri?: ValueField<string>;
}

interface Source {
  id?: ValueField<string>;
  title?: ValueField<string>;
  updated?: ValueField<Date>;
  updatedRaw?: ValueField<string>;
}

interface Text {
  type?: string;
  value?: string;
}
