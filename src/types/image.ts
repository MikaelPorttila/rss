// https://validator.w3.org/feed/docs/rss2.html#ltimagegtSubelementOfLtchannelgt
export interface Image {
  url: string;
  title: string;
  link: string;
  width?: number;
  height?: number;
}
