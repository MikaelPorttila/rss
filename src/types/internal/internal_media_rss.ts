import type { ValueField } from "../value_field.ts";
import { MediaRssFields } from "../fields/mod.ts";

// Based on https://www.rssboard.org/media-rss
export interface InternalMediaRss {
  [MediaRssFields.Rating]?: ValueField<string>;
  [MediaRssFields.Title]?: {
    value?: string;
    type?: string;
  };
  [MediaRssFields.Description]?: {
    value?: string;
    type?: string;
  };
  [MediaRssFields.Content]?: {
    url?: string;
    fileSize?: string;
    type?: string;
    medium?: string;
    isDefault?: string;
    expression?: string;
    bitrate?: string;
    samplingrate?: string;
    channels?: string;
    duration?: string;
    height?: number;
    width?: number;
    lang?: string;
  }[];
  [MediaRssFields.Group]?: {
    [MediaRssFields.Content]?: {
      url?: string;
      fileSize?: string;
      type?: string;
      medium?: string;
      isDefault?: string;
      expression?: string;
      bitrate?: string;
      samplingrate?: string;
      channels?: string;
      duration?: string;
      height?: number;
      width?: number;
      lang?: string;
    }[];
  }[];
  [MediaRssFields.Keywords]?: ValueField<string>;
  [MediaRssFields.Thumbnails]?: {
    url?: string;
    width?: number;
    height?: number;
    time?: string;
  };
  [MediaRssFields.Category]?: ValueField<string>;
  [MediaRssFields.Hash]?: {
    value?: string;
    algo?: string;
  };
  [MediaRssFields.Player]?: {
    url?: string;
    height?: number;
    width?: number;
  };
  [MediaRssFields.Credit]?: {
    value?: string;
    role?: string;
    scheme?: string;
  };
  [MediaRssFields.Copyright]?: {
    url?: string;
    value?: string;
  };
  [MediaRssFields.Text]?: {
    value?: string;
    type?: string;
    lang?: string;
    start?: string;
    end?: string;
  };
  [MediaRssFields.Restriction]?: {
    value?: string;
    relationship?: string;
    type?: string;
  };
  [MediaRssFields.Community]?: {
    [MediaRssFields.StarRating]?: {
      average?: string;
      count?: string;
      min?: string;
      max?: string;
    };
    [MediaRssFields.Statistics]?: {
      views?: string;
      favorites?: string;
    };
    [MediaRssFields.Tags]?: {
      value?: string;
    };
  };
  [MediaRssFields.Comments]?: {
    "media:comment"?: ValueField<string>[];
  };
  [MediaRssFields.Embed]?: {
    url?: string;
    height?: string;
    width?: string;
    [MediaRssFields.Param]?: {
      value?: string;
      name?: string;
    };
  };
  [MediaRssFields.Responses]?: {
    [MediaRssFields.Response]?: ValueField<string>[];
  };
  [MediaRssFields.BackLinks]?: {
    [MediaRssFields.BackLink]?: ValueField<string>[];
  };
  [MediaRssFields.Status]?: {
    state?: string;
    reason?: string;
  };
  [MediaRssFields.Price]?: {
    type?: string;
    price?: string;
    info?: string;
    currency?: string;
  };
  [MediaRssFields.License]?: {
    value?: string;
    type?: string;
    href?: string;
  };
  [MediaRssFields.Subtitle]?: {
    type?: string;
    lang?: string;
    href?: string;
  };
  [MediaRssFields.PeerLink]?: {
    type?: string;
    href?: string;
  };
  [MediaRssFields.Rights]?: {
    status?: string;
  };
  [MediaRssFields.Scenes]?: {
    [MediaRssFields.Scene]?: {
      sceneTitle?: ValueField<string>;
      sceneDescription?: ValueField<string>;
      sceneStartTime?: ValueField<string>;
      sceneEndTime?: ValueField<string>;
    }[];
  };
}

export const MediaRssFieldArray = [
  MediaRssFields.Rating,
  MediaRssFields.Title,
  MediaRssFields.Description,
  MediaRssFields.Keywords,
  MediaRssFields.Thumbnails,
  MediaRssFields.Category,
  MediaRssFields.Hash,
  MediaRssFields.Player,
  MediaRssFields.Credit,
  MediaRssFields.Copyright,
  MediaRssFields.Text,
  MediaRssFields.Restriction,
  MediaRssFields.Community,
  MediaRssFields.Comments,
  MediaRssFields.Embed,
  MediaRssFields.Responses,
  MediaRssFields.BackLinks,
  MediaRssFields.Status,
  MediaRssFields.Price,
  MediaRssFields.License,
  MediaRssFields.Subtitle,
  MediaRssFields.PeerLink,
  MediaRssFields.Rights,
  MediaRssFields.Scenes,
  MediaRssFields.Tags,
];
