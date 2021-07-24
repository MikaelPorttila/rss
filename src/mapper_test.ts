import { assert, assertEquals, assertNotEquals } from "../test_deps.ts";
import { toFeed } from './mapper.ts';
import { Feed } from "./types/feed.ts";
import { FeedType } from "./types/feed-type.ts";
import { InternalAtom } from "./types/internal-atom.ts";
import { InternalRSS2 } from "./types/internal-rss2.ts";

const composeAtom = (setter: (data: InternalAtom) => void  = () => {}): InternalAtom => {
	const result = { } as InternalAtom;
	setter && setter(result);
	return result;
}

const composeRss2 = (setter: (data: InternalRSS2) => void = () => {}): InternalRSS2 => {
	const result = {
		version: 1,
		channel: {
			title: {
				value: 'RSS2:Channel:Title:Value'
			},
			link: {
				value: 'RSS2:Channel:Link:Value'
			},
			description: {
				value: 'RSS2:Channel:Description:Value'
			},
			language: {
				value: 'RSS2:Channel:Language:Value'
			},
			copyright: {
				value: 'RSS2:Channel:Copyright:Value'
			},
			managingEditor: {
				value: 'RSS2:Channel:ManagingEditor:Value'
			},
			webMaster: {
				value: 'RSS2:Channel:WebMaster:Value'
			},
			pubDate: {
				value: new Date('Mon, 22 Jun 2020 20:03:00 GMT')
			},
			pubDateRaw: {
				value: 'Mon, 22 Jun 2020 20:03:00 GMT'
			},
			docs: {
				value: 'RSS2:Channel:Docs:Value'
			},
			generator: {
				value: 'RSS2:Channel:Generator:Value'
			},
			lastBuildDate: {
				value: new Date('Mon, 22 Jun 2020 20:03:00 GMT')
			},
			lastBuildDateRaw: {
				value: 'Mon, 22 Jun 2020 20:03:00 GMT'
			},
			skipDays: {
				day: [
					{ value: 'RSS2:Channel:SkipDays:Day:0' },
					{ value: 'RSS2:Channel:SkipDays:Day:1' },
					{ value: 'RSS2:Channel:SkipDays:Day:2' },
					{ value: 'RSS2:Channel:SkipDays:Day:3' },
					{ value: 'RSS2:Channel:SkipDays:Day:4' },
					{ value: 'RSS2:Channel:SkipDays:Day:5' },
					{ value: 'RSS2:Channel:SkipDays:Day:6' }
				]
			},
			skipHours: {
				hour: [
					{value: 0},
					{value: 1},
					{value: 2},
					{value: 3},
					{value: 4},
					{value: 5},
					{value: 6},
					{value: 7},
					{value: 8},
					{value: 9},
					{value: 10},
					{value: 11},
					{value: 12},
					{value: 13},
					{value: 14},
					{value: 15},
					{value: 16},
					{value: 17},
					{value: 18},
					{value: 19},
					{value: 20},
					{value: 21},
					{value: 22},
					{value: 23},
				]
			},
			ttl: {
				value: 100
			},
			image: {
				url: {
					value: 'RSS2:Channel:Image:Url:Value'
				},
				title: {
					value: 'RSS2:Channel:Image:Title:Value'
				},
				link: {
					value: 'RSS2:Channel:Image:Link:Value'
				},
				height: {
					value: 69
				},
				width: {
					value: 34
				}
			},
			items: [
				{
					title: {
						value: 'RSS2:Channel:Item:0:Title:Value'
					},
					description: {
						value: 'RSS2:Channel:Item:0:Description:Value'
					},
					link: {
						value: 'RSS2:Channel:Item:0:Link:Value'
					},
					guid: {
						value: 'RSS2:Channel:Item:0:Guid:Value'
					},
					comments: {
						value: 'RSS2:Channel:Item:0:Comments:Value'
					},
					categories: [
						{ value: 'RSS2:Channel:Item:0:Categories:0:Value' },
						{ value: 'RSS2:Channel:Item:0:Categories:1:Value' }
					],
					"media:content": {
						height: 69,
						width: 32,
						medium: 'RSS2:Channel:Item:0:MediaContent:Medium',
						url: 'RSS2:Channel:Item:0:MediaContent:Url',
					},
					"media:credit": {
						value: 'RSS2:Channel:Item:0:MediaCredit:Value'
					},
					"media:description": {
						value: 'RSS2:Channel:Item:0:MediaDescription:Value'
					}
				},
				{
					title: {
						value: 'RSS2:Channel:Item:1:Title:Value'
					},
					description: {
						value: 'RSS2:Channel:Item:1:Description:Value'
					},
					link: {
						value: 'RSS2:Channel:Item:1:Link:Value'
					},
					guid: {
						value: 'RSS2:Channel:Item:1:Guid:Value'
					},
					comments: {
						value: 'RSS2:Channel:Item:1:Comments:Value'
					},
					categories: [
						{ value: 'RSS2:Channel:Item:1:Categories:0:Value' },
						{ value: 'RSS2:Channel:Item:1:Categories:1:Value' }
					]
				},
				{
					title: {
						value: 'RSS2:Channel:Item:2:Title:Value'
					},
					description: {
						value: 'RSS2:Channel:Item:2:Description:Value'
					},
					link: {
						value: 'RSS2:Channel:Item:2:Link:Value'
					},
					guid: {
						value: 'RSS2:Channel:Item:2:Guid:Value'
					},
					comments: {
						value: 'RSS2:Channel:Item:2:Comments:Value'
					},
					categories: [
						{ value: 'RSS2:Channel:Item:2:Categories:0:Value' },
						{ value: 'RSS2:Channel:Item:2:Categories:1:Value' }
					]
				}
			]
		}
	} as InternalRSS2;
	setter && setter(result);
	return result;
}

const testTextField = (fieldName: string, target: any, type: string | undefined, value: string) => {
	return [
		{
			name: fieldName,
			getValue: (src: Feed) => target(src),
			assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]
		},
		{
			name: `${fieldName}:Type`,
			getValue: (src: Feed) => target(src).type,
			assert: [{ fn: assertEquals, expect: type}]
		},
		{
			name: `${fieldName}:Value`,
			getValue: (src: Feed) => target(src).value,
			assert: [{ fn: assertEquals, expect: value }]
		},
	];
}

const testArrayLength = (fieldName: string, target: any, expectedLength: number) => {
	return [
		{
			name: fieldName,
			getValue: (src: Feed) => target(src),
			assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]
		},
		{
			name: `${fieldName}:Length`,
			getValue: (src: Feed) => target(src).length,
			assert: [{ fn: assertEquals, expect: expectedLength }]
		}
	];
}

[
	{
		name: 'RSS2',
		source: toFeed(FeedType.Rss2, composeRss2()) as Feed,
		tests: [
			{
				name: 'Root',
				getValue: (src: Feed) => src,
				assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]
			},
			...testTextField('Title', (src: Feed) => src.title, undefined, 'RSS2:Channel:Title:Value'),
			{
				name: 'Description',
				getValue: (src: Feed) => src.description,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Description:Value' }]
			},
			{
				name: 'Language',
				getValue: (src: Feed) => src.language,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Language:Value' }]
			},
			...testArrayLength('Link', (src:Feed) => src.links, 1),
			{
				name: 'Link:Value:0',
				getValue: (src: Feed) => src.links[0],
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Link:Value' }]
			},
			{
				name: 'Copyright',
				getValue: (src: Feed) => src.copyright,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Copyright:Value' }]
			},
			{
				name: 'ManagingEditor',
				getValue: (src: Feed) => src.managingEditorMail,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:ManagingEditor:Value' }]
			},
			{
				name: 'WebMaster',
				getValue: (src: Feed) => src.webMasterMail,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:WebMaster:Value' }]
			},
			{
				name: 'PubDate',
				getValue: (src: Feed) => src.published,
				assert: [{ fn: assertEquals, expect: new Date('Mon, 22 Jun 2020 20:03:00 GMT') }]
			},
			{
				name: 'PubDateRaw',
				getValue: (src: Feed) => src.publishedRaw,
				assert: [{ fn: assertEquals, expect: 'Mon, 22 Jun 2020 20:03:00 GMT' }]
			},
			{
				name: 'Docs',
				getValue: (src: Feed) => src.docs,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Docs:Value' }]
			},
			{
				name: 'Generator',
				getValue: (src: Feed) => src.generator,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Generator:Value' }]
			},
			{
				name: 'LastBuildDate',
				getValue: (src: Feed) => src.created,
				assert: [{ fn: assertEquals, expect: new Date('Mon, 22 Jun 2020 20:03:00 GMT') }]
			},
			{
				name: 'LastBuildDateRaw',
				getValue: (src: Feed) => src.createdRaw,
				assert: [{ fn: assertEquals, expect: 'Mon, 22 Jun 2020 20:03:00 GMT' }]
			},
			...testArrayLength('SkipDays', (src:Feed) => src.skipDays, 7),
			...testArrayLength('SkipHours', (src:Feed) => src.skipHours, 24),
			{
				name: 'SkipDays:0',
				getValue: (src: Feed) => src.skipDays?.[0],
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:SkipDays:Day:0' }]
			},
			{
				name: 'SkipDays:6',
				getValue: (src: Feed) => src.skipDays?.[6],
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:SkipDays:Day:6' }]
			},
			{
				name: 'SkipHours:0',
				getValue: (src: Feed) => src.skipDays?.[0],
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:SkipDays:Day:0' }]
			},
			{
				name: 'SkipHours:23',
				getValue: (src: Feed) => src.skipHours?.[23],
				assert: [{ fn: assertEquals, expect: 23 }]
			},
			{
				name: 'Ttl',
				getValue: (src: Feed) => src.ttl,
				assert: [{ fn: assertEquals, expect: 100 }]
			},
			{
				name: 'Image',
				getValue: (src: Feed) => src.image,
				assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]
			},
			{
				name: 'Image:Url',
				getValue: (src: Feed) => src.image?.url,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Image:Url:Value' }]
			},
			{
				name: 'Image:Title',
				getValue: (src: Feed) => src.image?.title,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Image:Title:Value' }]
			},
			{
				name: 'Image:Link',
				getValue: (src: Feed) => src.image?.link,
				assert: [{ fn: assertEquals, expect: 'RSS2:Channel:Image:Link:Value' }]
			},
			{
				name: 'Image:Height',
				getValue: (src: Feed) => src.image?.height,
				assert: [{ fn: assertEquals, expect: 69 }]
			},
			{
				name: 'Image:Width',
				getValue: (src: Feed) => src.image?.width,
				assert: [{ fn: assertEquals, expect: 34 }]
			},
			...testArrayLength('Items', (src:Feed) => src.entries, 3),
		]
	}
].forEach((workspace) => {
	workspace.tests.forEach((test) => {
		Deno.test(`toFeed-${workspace.name}:${test.name}`, () => {
      const target = test.getValue(workspace.source);
      test.assert.forEach((x) => x.fn(target, x.expect));
    });
	});
});


