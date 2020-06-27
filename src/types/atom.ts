// https://validator.w3.org/feed/docs/atom.html

export interface Feed {
  id: string;
  title: string;
  icon: string;
  updated: Date;
  links: Link[];
  entries: Entry[];
  categories: Category[];
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
  summary: string;
  rights: Rights;
  categories: string[];
  source: Source;
}

interface Content {
  type: string;
  src?: string;
  value: string;
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

interface Rights {
  type: string;
  value: string;
}
