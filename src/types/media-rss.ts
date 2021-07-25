import { ValueField } from "./value-field.ts";

// Based on https://www.rssboard.org/media-rss
export interface MediaRssValueFields {
	'media:rating'?: ValueField<string>;
	'media:title'?: {
		value?: string;
		type?: string;
	};
	'media:description'?: {
		value?: string;
		type?: string;
	};
	'media:content'?: {
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
		height?: string;
		width?: string;
		lang?: string;
	};
	'media:group'?: ValueField<string>;
	'media:keywords'?: ValueField<string>;
	'media:thumbnails'?: {
		url?: string;
		width?: string;
		height?: string;
		time?: string;
	};
	'media:category'?: ValueField<string>;
	'media:hash'?: {
		value?: string;
		algo?: string;
	};
	'media:player'?: {
		url?: string;
		height?: string;
		width?: string;
	};
	'media:credit'?: {
		role?: string;
		scheme?: string;
	};
	'media:copyright'?: {
		url?: string;
		value?: string;
	};
	'media:text'?: {
		value?: string;
		type?: string;
		lang?: string;
		start?: string;
		end?: string;
	};
	'media:restriction'?: {
		value?: string;
		relationship?: string;
		type?: string;
	};
	'media:community'?: {
		'media:starRating'?: {
			average?: string;
			count?: string;
			min?: string;
			max?: string;
		},
		'media:statistics'?: {
			views?: string;
			favorites?: string;
		},
		'media:tags'?: {
			value?: string;
		}
	};
	'media:comments'?: {
		'media:comment'?: ValueField<string>[];
	};
	'media:embed'?: {
		url?: string;
		height?: string;
		width?: string;
		'media:param'?: {
			value?: string;
			name?: string;
		}[];
	};
	'media:responses'?: {
		'media:response'?: ValueField<string>[];
	};
	'media:backLinks'?: {
		'media:backLink'?: ValueField<string>[];
	};
	'media:status'?: {
		state?: string;
		reason?: string;
	};
	'media:price'?: {
		type?: string;
		price?: string;
		info?: string;
		currency?: string;
	};
	'media:license'?: {
		value?: string;
		type?: string;
		href?: string;
	};
	'media:subTitle'?: {
		type?: string;
		lang?: string;
		href?: string;
	};
	'media:peerLink'?: {
		type?: string;
		href?: string;
	};
	'media:rights'?: {
		status?: string;
	};
	'media:scenes'?: {
		'media:scene'?: {
			sceneTitle?: ValueField<string>;
			sceneDescription?: ValueField<string>;
			sceneStartTime?: ValueField<string>;
			sceneEndTime?: ValueField<string>;
		}[];
	};
}

export enum MediaRssFields {
	Rating = 'media:rating',
	Title = 'media:title',
	Description = 'media:description',
	Content = 'media:content',
	Group = 'media:group',
	Keywords = 'media:keywords',
	Thumbnails = 'media:thumbnails',
	Category = 'media:category',
	Hash = 'media:hash',
	Player = 'media:player',
	Credit = 'media:credit',
	Copyright = 'media:copyright',
	Text = 'media:text',
	Restriction = 'media:restriction',
	Community = 'media:community',
	Comments = 'media:comments',
	Embed = 'media:embed',
	Responses = 'media:responses',
	BackLinks = 'media:backLinks',
	Status = 'media:status',
	Price = 'media:price',
	License = 'media:license',
	Subtitle = 'media:subTitle',
	PeerLink = 'media:peerLink',
	Rights = 'media:rights',
	Scenes = 'media:scenes'
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
	MediaRssFields.Scenes
];
