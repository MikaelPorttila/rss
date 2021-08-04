/*
	Type is based on the W3 Atom documentation:
	https://validator.w3.org/feed/docs/atom.html
*/

import { AtomFields } from "./fields/atom_fields.ts";

export interface Atom {
  id: string;
  title: AtomText;
  updated: Date;
  updatedRaw: string;
  icon?: string;
  links?: AtomLink[];
  entries: AtomEntry[];
  categories?: AtomCategory[];
  contributors?: AtomPerson[];
  generator?: string;
  author?: AtomPerson;
  logo?: string;
  rights?: AtomText;
  subtitle?: string;
}

export interface AtomLink {
  type: string;
  href: string;
  rel: string;
  hreflang?: string;
  length?: number;
}

export interface AtomCategory {
  term: string;
  label?: string;
}

export interface AtomEntry {
  id: string;
  title: AtomText;
  updated: Date;
  updatedRaw: string;
  published?: Date;
  publishedRaw?: string;
  content?: AtomContent;
  links?: AtomLink[];
  author?: AtomPerson;
  contributors?: AtomPerson[];
  summary?: AtomText;
  rights?: AtomText;
  categories?: AtomCategory[];
  source?: AtomSource;
  href?: string;
  [AtomFields.FeedburnerOrigLink]?: string;
}

export interface AtomContent extends AtomText {
  src?: string;
}

export interface AtomPerson {
  name: string;
  email?: string;
  uri?: string;
}

export interface AtomSource {
  id?: string;
  title?: string;
  updated?: Date;
  updatedRaw?: Date;
}

export interface AtomText {
  type: string;
  value: string;
}
