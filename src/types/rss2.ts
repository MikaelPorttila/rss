// https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements

export interface RSS2 {
  version: number;
  channel: {
    title: string;
    link: string;
    description: string;
    items: {
      title: string;
      link: string;
      description: string;
      author: string;
      categories: string[];
      comments: string;
      enclosure?: {
        url: string;
        length: number;
        type: string;
      };
      guid?: string;
      pubDate?: Date;
      source?: {
        title: string;
        url: string;
      };
    }[];
    language?: string;
    copyright?: string;
    managingEditor?: string;
    webMaster?: string;
    pubDate?: Date;
    lastBuildDate?: Date;
    category?: string[];
    generator?: string;
    docs?: string;
    cloud?: {
      domain: string;
      port: number;
      path: string;
      registerProcedure: string;
      protocol: string;
    };
    ttl?: number;
    image?: {
      url: string;
      title: string;
      link: string;
      width?: number;
      height?: number;
    };
    textInput?: any; // TODO: Fix
    skipHours?: number;
    skipDays?:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday";
  };
}
