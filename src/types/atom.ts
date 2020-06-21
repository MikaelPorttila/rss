// https://validator.w3.org/feed/docs/atom.html

export interface Feed {
  id: string;
  title: string;
  icon: string;
  updated: Date;
  links: Link[];
  entries: Entry[];
  categories: string[];
}

export interface Link {
  type: string;
  href: string;
  rel: string;
}

export interface Entry {
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

export interface Content {
  type: string;
  src?: string;
  value: string;
}

export interface Person {
  name: string;
  email: string;
  uri: string;
}

export interface Source {
  id: string;
  title: string;
  updated: Date;
}

export interface Rights {
  type: string;
  value: string;
}

export enum Field {
  Feed = "feed",
  Id = "id",
  Title = "title",
  Icon = "icon",
  Updated = "updated",
  Link = "link",
  Entry = "entry",
  Category = "category",
  Type = "type",
  Href = "href",
  Rel = "rel",
  Author = "author",
  Contributer = "contributer",
  Summary = "summary",
  Rights = "rights",
  Source = "source",
  Src = "src",
  Value = "value",
  Name = "name",
  Published = "published",
  Email = "email",
  Uri = "uri",
}

export const isDateField = (fieldName: string): boolean => {
  switch (fieldName) {
    case Field.Updated:
    case Field.Published:
      return true;
    default:
      return false;
  }
};
