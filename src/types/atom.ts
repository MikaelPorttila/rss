// https://validator.w3.org/feed/docs/atom.html

export interface Feed {
  id: string;
  title: Text;
  icon: string;
  updated: Date;
  links: Link[];
  entries: Entry[];
  categories: Category[];
  author: Person;
}

interface Link {
  type: string;
  href: string;
  rel: string;
}

interface Category {
  term: string;
}

interface Entry {
  id: string;
  published: Date;
  updated: Date;
  title: string;
  content: Content;
  links: Link[];
  author: Person;
  contributors: Person[];
  summary: Text;
  rights: Text;
  categories: string[];
  source: Source;
}

interface Content extends Text {
  src?: string;
}

interface Person {
  name: string;
  email: string;
  uri: string;
}

interface Source {
  id: string;
  title: string;
  updated: Date;
}

interface Text {
  type: string;
  value: string;
}