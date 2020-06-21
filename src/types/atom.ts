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
  Feed = 'FEED',
  Id = 'ID',
  Title = 'TITLE',
  Icon = 'ICON',
  Updated = 'UPDATED',
  Link = 'LINK',
  Entry = 'ENTRY',
  Category = 'CATEGORY',
  Type = 'TYPE',
  Href = 'HREF',
  Rel = 'REL',
  Author = 'AUTHOR',
  Contributer = 'CONTRIBUTER',
  Summary = 'SUMMARY',
  Rights = 'RIGHTS',
  Source = 'SOURCE',
  Src = 'SRC',
  Value = 'VALUE',
  Name = 'NAME',
  Published = 'PUNLISHED',
  Email = 'EMAIL',
  Uri = 'URI',
}

export const isValueField = (fieldName: string): boolean => {
  switch(fieldName) {
    case Field.Id:
    case Field.Title:
    case Field.Icon:
    case Field.Updated:
    case Field.Type:
    case Field.Href:
    case Field.Rel:
    case Field.Summary:
    case Field.Type:
    case Field.Src:
    case Field.Value:
    case Field.Name:
    case Field.Email:
    case Field.Uri:
    // TODO: fix this list.
      return true;
    default:
      return false;
  }
}

export const isDateField = (fieldName: string): boolean => {
  switch(fieldName) {
    case Field.Updated:
    case Field.Published:
      return true;
    default:
      return false;
  }
}