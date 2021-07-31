// https://validator.w3.org/feed/docs/atom.html

import { AtomFields } from "../resolvers/types/atom-fields.ts";

export interface Atom {
  id: string;
  title: Text;
  updated: Date;
  updatedRaw: string;
  icon?: string;
  links?: Link[];
  entries: Entry[];
  categories?: Category[];
  contributors?: Person[];
  generator?: string;
  author?: Person;
  logo?: string;
  rights?: Text;
  subtitle?: string;
}

interface Link {
  type: string;
  href: string;
  rel: string;
  hreflang?: string;
  length?: number;
}

interface Category {
  term: string;
  label?: string;
}

interface Entry {
  id: string;
  title: Text;
  updated: Date;
  updatedRaw: string;
  published?: Date;
  publishedRaw?: string;
  content?: Content;
  links?: Link[];
  author?: Person;
  contributors?: Person[];
  summary?: Text;
  rights?: Text;
  categories?: Category[];
  source?: Source;
  href?: string;
  [AtomFields.FeedburnerOrigLink]?: string;
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
  updatedRaw?: Date;
}

interface Text {
  type: string;
  value: string;
}
