//https://validator.w3.org/feed/docs/rss2.html#ltenclosuregtSubelementOfLtitemgt
export interface Enclosure {
  url: string;
  length: number;
  type: string;
}
