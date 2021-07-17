import {
	assert,
	assertEquals,
	assertNotEquals,
	assertThrowsAsync,
} from "../test_deps.ts";
import { deserializeFeed, parseFeed } from "./deserializer.ts";
import { Feed, FeedType } from "../mod.ts";
import type { DeserializationResult, Atom, Options, RSS2 } from "../mod.ts";

const rss2TestSample = await Deno.readTextFile("./samples/rss2.xml");
const rss2DublinCoreTestSample = await Deno.readTextFile("./samples/rss2_dublin-core.xml");
const atomTestSample = await Deno.readTextFile("./samples/atom.xml");


[undefined, null, ""].forEach((input: any) => {
	Deno.test(`Bad input: ${input}`, () => {
		assertThrowsAsync(async () => {
			await deserializeFeed(input);
		});
	});
});

Deno.test(`Unsupported format handling`, () => {
	assertThrowsAsync(async () => {
		await deserializeFeed("<test></test>");
	});
});

Deno.test(`Call signatures compile without error`, async () => {
	/* because this is a test only for the compiler, the condition is false, so
   * that none of the code will be executed, but it will still be type-checked
   */
	let n = 0;
	if (n > 0) {
		const result1 = await deserializeFeed(rss2TestSample);
		const result2 = await deserializeFeed(rss2TestSample, { outputJsonFeed: true });
		const result3 = await deserializeFeed(rss2TestSample, { outputJsonFeed: false });

		const options: Options = {};
		const result4 = await deserializeFeed(rss2TestSample, options);
	}
});

Deno.test("Deserialize RSS2", async (): Promise<void> => {
	const { feed, feedType } =
		(await deserializeFeed(rss2TestSample)) as DeserializationResult<RSS2>;

	assertEquals(feedType, FeedType.Rss2);
	assert(!!feed, "Deserializer returned undefined");

	const { items, pubDate, ttl, copyright, link } = feed.channel;
	assertNotEquals(ttl, undefined, "Missing ttl");
	assertEquals(
		typeof (ttl),
		typeof (2),
		"ttl was not deserializes into number",
	);
	assertEquals(typeof (pubDate), typeof (new Date()));
	assert(!!copyright, "Channel is missing copyright value");
	assert(!!link, "Channel is missing link value");

	assert(items.length > 0, "Channel is missing items");
	for (const item of items) {
		assert(!!item.title, "Item is missing title value");
		assert(!!item.guid, "Item is missing guid value");
		assert(!!item['dc:creator'], 'Item is missing dc:creator');
		assertEquals(
			typeof (item.pubDate),
			typeof (new Date()),
			"Item.pubDate was not converted into date",
		);
	}

	for (const item of items.slice(0, 8)) {
		assert(!!item.description, "Item is missing description value");
		assert(!!item.link, "Item is missing link value");
	}

	const itemWithMissingEndTags = items.find(x => x.guid === 'itemWithMissingEndTags');
	assertNotEquals(itemWithMissingEndTags, null, 'Was not able to find item with guid itemDescriptionWithoutEndTag');
	assertEquals(itemWithMissingEndTags?.description, undefined, 'Item Description was suppose to be undefined');
	assertEquals(itemWithMissingEndTags?.link, undefined, 'Item link was suppose to be undefined');

	const itemWithMultipleDublinCoreCreators = items.find(x => x.guid === 'itemWithMultipleDCCreators');
	assertNotEquals(itemWithMultipleDublinCoreCreators, null, 'Was not able to find item with guid itemWithMultipleDublinCoreCreators');
	assertEquals(itemWithMultipleDublinCoreCreators?.["dc:creator"]?.length, 2, `Actual: ${itemWithMultipleDublinCoreCreators?.["dc:creator"]}, Expected: 2`);
});

Deno.test("Deserialize RSS2 with convertToJsonFeed option", async () => {
	const { feed, feedType } = await deserializeFeed(rss2TestSample, {
		outputJsonFeed: true,
	});

	assert(!!feed, "Result was undefined");
	assertEquals(feedType, FeedType.JsonFeed);
});

Deno.test("Deserialize ATOM", async (): Promise<void> => {
	const { feed, feedType } =
		(await deserializeFeed(atomTestSample)) as DeserializationResult<Atom>;

	assert(!!feed, "Feed was undefined");
	assert(!!feed.id, "Feed is missing id value");
	assert(!!feed.title, "Feed is missing title value");
	assert(!!feed.icon, "Feed is missing icon value");
	assert(!!feed.entries, "Feed is missing entries value");
	assert(!!feed.categories, "Feed is missing categories value");
	assertEquals(
		typeof (feed.updated),
		typeof (new Date()),
		"Feed is missing icon value",
	);

	assert(!!feed.author, "Feed is missing author");
	assert(!!feed.author.email, "Feed Author is missing email value");
	assert(!!feed.author.name, "Feed Author is missing name value");
	assert(!!feed.author.uri, "Feed Author is missing uri value");

	for (const category of feed.categories) {
		assert(!!category.term, "Category is missing term value");
	}

	for (const entry of feed.entries) {
		assert(!!entry.author, "Entry is missing author value");
		assert(!!entry.title, "Entry is missing title value");
		assert(!!entry.published, "Entry is missing published value");
		assert(!!entry.updated, "Entry is missing updated value");
		assert(!!entry.id, "Entry is missing id value");
		assert(!!entry.content, "Entry is missing content value");
		assert(!!entry.links, "Entry is missing links value");
		assert(!!entry.contributors, "Entry is missing contributors value");
		assert(!!entry.summary, "Entry is missing summary value");
		assert(!!entry.rights, "Entry is missing rights value");
		assert(!!entry.categories, "Entry is missing categories value");
		assert(!!entry.source, "Entry is missing source value");
		assert(!!entry.source.id, "Entry source is missing id value");
		assert(!!entry.source.title, "Entry source is missing title value");
		assert(!!entry.source.updated, "Entry source is missing updated value");
		assert(!!entry.rights.type, "Entry rights is missing type value");
		assert(!!entry.rights.value, "Entry rights is missing value");
		assert(!!entry.author.email, "Entry Author is missing email value");
		assert(!!entry.author.name, "Entry Author is missing name value");
		assert(!!entry.author.uri, "Entry Author is missing uri value");
	}
});

Deno.test("Deserialize ATOM with convertToJsonFeed option", async () => {
	const { feed, feedType } = await deserializeFeed(atomTestSample, { outputJsonFeed: true });

	assert(!!feed, "Result was undefined");
	assertEquals(feedType, FeedType.JsonFeed);
	assertEquals(
		feed.items[0].title,
		'<div xmlns="http://www.w3.org/1999/xhtml">HTML&Test Brough to you by<b>Test</b>!</div>',
		"Title was not mapped correctly",
	);
});

Deno.test("Returns correct original feedType with outputJsonFeed option", async () => {
	const atomJsonFeed = await deserializeFeed(atomTestSample, { outputJsonFeed: true });
	assertEquals(FeedType.Atom, atomJsonFeed.originalFeedType);
	const rssJsonFeed = await deserializeFeed(rss2TestSample, { outputJsonFeed: true });
	assertEquals(FeedType.Rss2, rssJsonFeed.originalFeedType);
});

/*
	(New) Parse Feed Tests
*/

[
	{
		name: 'RSS2',
		source: await parseFeed(rss2TestSample),
		tests: [
			{ name: 'Root', getValue: (src) => src, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Type', getValue: (src) => src.type, assert: [{ fn: assertEquals, expect: FeedType.Rss2 }] },
			{ name: 'Title', getValue: (src) => src.title, assert: [{ fn: assertNotEquals, expect: undefined }] },
			{ name: 'Title:Type', getValue: (src) => src.title.type, assert: [{ fn: assertEquals, expect: undefined }] },
			{ name: 'Title:Value', getValue: (src) => src.title.value, assert: [{ fn: assertEquals, expect: 'RSS2:Title:CData' }] },
			{ name: 'Description', getValue: (src) => src.description, assert: [{ fn: assertEquals, expect: 'RSS2:Description:CData' }] },
			{ name: 'Language', getValue: (src) => src.language, assert: [{ fn: assertEquals, expect: 'RSS2:Language' }] },
			{ name: 'Uri', getValue: (src) => src.links[0], assert: [{ fn: assertEquals, expect: 'https://RSS2-link.com/' }] },
			{ name: 'Image', getValue: (src) => src.image, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Image:Url', getValue: (src) => src.image?.url, assert: [{ fn: assertEquals, expect: 'RSS2-image.com' }] },
			{ name: 'Image:Title', getValue: (src) => src.image?.title, assert: [{ fn: assertEquals, expect: 'RSS2:Image' }] },
			{ name: 'Image:Link', getValue: (src) => src.image?.link, assert: [{ fn: assertEquals, expect: 'RSS2-image2.com' }] },
			{ name: 'Image:Height', getValue: (src) => src.image?.height, assert: [{ fn: assertEquals, expect: 69 }] },
			{ name: 'Image:Width', getValue: (src) => src.image?.width, assert: [{ fn: assertEquals, expect: 420 }] },
			{ name: 'PubDate', getValue: (src) => src.published, assert: [{ fn: assertEquals, expect: new Date('Mon, 22 Jun 2020 20:03:00 GMT') }] },
			{ name: 'PubDateRaw', getValue: (src) => src.publishedRaw, assert: [{ fn: assertEquals, expect: 'Mon, 22 Jun 2020 20:03:00 GMT' }] },
			{ name: 'LastBuildDate', getValue: (src) => src.updateDate, assert: [{ fn: assertEquals, expect: new Date('Mon, 22 Jun 2020 20:03:04 GMT') }] },
			{ name: 'LastBuildDateRaw', getValue: (src) => src.updateDateRaw, assert: [{ fn: assertEquals, expect: 'Mon, 22 Jun 2020 20:03:04 GMT' }] },
			{ name: 'Generator', getValue: (src) => src.generator, assert: [{ fn: assertEquals, expect: 'RSS2:Generator' }] },
			{ name: 'Copyright', getValue: (src) => src.copyright, assert: [{ fn: assertEquals, expect: 'RSS2:Copyright' }] },
			{ name: 'SkipDays', getValue: (src) => src.skipDays, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'SkipDays:Length', getValue: (src) => src.skipDays?.length, assert: [{ fn: assertEquals, expect: 7 }] },
			{ name: 'SkipHours', getValue: (src) => src.skipHours, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'SkipHours:Length', getValue: (src) => src.skipHours?.length, assert: [{ fn: assertEquals, expect: 24 }] },
			{ name: 'WebMaster', getValue: (src) => src.webMasterMail, assert: [{ fn: assertEquals, expect: 'mail@RSS2-webMaster.com' }] },
			{ name: 'ManagingEditor', getValue: (src) => src.managingEditorMail, assert: [{ fn: assertEquals, expect: 'mail@wRSS2-managingEditor.com' }] },
			{ name: 'Ttl', getValue: (src) => src.ttl, assert: [{ fn: assertEquals, expect: 100 }] },
			{ name: 'Items', getValue: (src) => src.entries, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]},
			{ name: 'Items:Length', getValue: (src) => src.entries.length, assert: [{ fn: assertEquals, expect: 10 }]},
			{ name: 'Items:[0]:Title:Type', getValue: (src) => src.entries[0].title?.type, assert: [{ fn: assertEquals, expect: undefined }]},
			{ name: 'Items:[0]:Title:Value', getValue: (src) => src.entries[0].title?.value, assert: [{ fn: assertEquals, expect: 'RSS2:Item:0:Title:CData' }]},
			{ name: 'Items:[0]:Guid', getValue: (src) => src.entries[0].id, assert: [{ fn: assertEquals, expect: 'https://RSS2-entry-0-link.com/0' }]},
			{ name: 'Items:[0]:Media:Credit', getValue: (src) => src.entries[0].mediaCredit, assert: [{ fn: assertEquals, expect: 'RSS2:Media:Credit' }]},
			{ name: 'Items:[0]:Media:Description', getValue: (src) => src.entries[0].mediaDescription, assert: [{ fn: assertEquals, expect: 'RSS2:Media:Description' }]},
			{ name: 'Items:[0]:Media:Content', getValue: (src) => src.entries[0].mediaContent, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]},
			{ name: 'Items:[0]:Media:Content:Url', getValue: (src) => src.entries[0].mediaContent?.url, assert: [{ fn: assertEquals, expect: 'https://RSS2-media-content.com/' }]},
			{ name: 'Items:[0]:Media:Content:Medium', getValue: (src) => src.entries[0].mediaContent?.medium, assert: [{ fn: assertEquals, expect: 'image' }]},
			{ name: 'Items:[0]:Media:Content:Width', getValue: (src) => src.entries[0].mediaContent?.width, assert: [{ fn: assertEquals, expect: 1337 }]},
			{ name: 'Items:[0]:Media:Content:Height', getValue: (src) => src.entries[0].mediaContent?.height, assert: [{ fn: assertEquals, expect: 1337 }]},
			{ name: 'Items:[0]:DC:Creator', getValue: (src) => src.entries[0].creators?.length, assert: [{ fn: assertEquals, expect: 1 }]},
			{ name: 'Items:[0]:DC:Creator:Length', getValue: (src) => src.entries[0].creators?.[0], assert: [{ fn: assertEquals, expect: 'RSS2:Item:0:DC:Creator' }]},
			{ name: 'Items:[0]:Description:Type', getValue: (src) => src.entries[0].description?.type, assert: [{ fn: assertEquals, expect: undefined }]},
			{ name: 'Items:[0]:Description:Value', getValue: (src) => src.entries[0].description?.value, assert: [{ fn: assertEquals, expect: 'RSS2:Item:0:Description:CData' }]},
			{ name: 'Items:[0]:Link', getValue: (src) => src.entries[0].link, assert: [{ fn: assertEquals, expect: 'https://RSS2-entry-0-link.com/0' }]},
			{ name: 'Items:[0]:Comments', getValue: (src) => src.entries[0].comments, assert: [{ fn: assertEquals, expect: 'https://RSS2-entry-0-comment.com/0' }]},
			{ name: 'Items:[0]:PubDate', getValue: (src) => src.entries[0].published, assert: [{ fn: assertEquals, expect: new Date('Mon, 22 Jun 2020 20:03:00 GMT') }]},
			{ name: 'Items:[0]:PubDateRaw', getValue: (src) => src.entries[0].publishedRaw, assert: [{ fn: assertEquals, expect: 'Mon, 22 Jun 2020 20:03:00 GMT' }]},
			{ name: 'Items:[0]:PubDate->Updated', getValue: (src) => src.entries[0].updated, assert: [{ fn: assertEquals, expect: new Date('Mon, 22 Jun 2020 20:03:00 GMT') }]},
			{ name: 'Items:[0]:PubDateRaw->UpdatedRaw', getValue: (src) => src.entries[0].updatedRaw, assert: [{ fn: assertEquals, expect: 'Mon, 22 Jun 2020 20:03:00 GMT' }]},
			{ name: 'Items:[0]:Category', getValue: (src) => src.entries[0].categories, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }]},
			{ name: 'Items:[0]:Category:Length', getValue: (src) => src.entries[0].categories?.length, assert: [{ fn: assertEquals, expect: 5 }]},
			{ name: 'Items:[0]:Category[0]:Term', getValue: (src) => src.entries[0].categories?.[0].term, assert: [{ fn: assertEquals, expect: 'RSS2:Item:0:Category:0' }]},
			{ name: 'Items:[0]:Category[0]:Label', getValue: (src) => src.entries[0].categories?.[0].label, assert: [{ fn: assertEquals, expect: 'RSS2:Item:0:Category:0' }]},
		] as TestDefinition[]
	},
	{
		name: 'RSS2:DublinCore',
		source: await parseFeed(rss2DublinCoreTestSample),
		tests: [

		] as TestDefinition[]
	},
	{
		name: 'Atom',
		source: await parseFeed(atomTestSample),
		tests: [
			{ name: 'Root', getValue: (src) => src, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Type', getValue: (src) => src.type, assert: [{ fn: assertEquals, expect: FeedType.Atom }] },
			{ name: 'Icon', getValue: (src) => src.icon, assert: [{ fn: assertEquals, expect: '/AtomIcon.jpg' }] },
			{ name: 'Updated', getValue: (src) => src.updateDate, assert: [{ fn: assertEquals, expect: new Date('2003-12-13T18:30:02Z') }] },
			{ name: 'UpdatedRaw', getValue: (src) => src.updateDateRaw, assert: [{ fn: assertEquals, expect: '2003-12-13T18:30:02Z' }] },
			{ name: 'Title', getValue: (src) => src.title, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Title:Type', getValue: (src) => src.title.type, assert: [{ fn: assertEquals, expect: undefined }] },
			{ name: 'Title:Value', getValue: (src) => src.title.value, assert: [{ fn: assertEquals, expect: 'ATOM:Title' }] },
			{ name: 'Category', getValue: (src) => src.categories, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Category:Length', getValue: (src) => src.categories.length, assert: [{ fn: assertEquals, expect: 2 }] },
			{ name: 'Category:[0]:Term', getValue: (src) => src.categories[0].term, assert: [{ fn: assertEquals, expect: 'ATOM:Category:0:Term' }] },
			{ name: 'Category:[1]:Term', getValue: (src) => src.categories[1].term, assert: [{ fn: assertEquals, expect: 'ATOM:Category:1:Term' }] },
			{ name: 'Image', getValue: (src) => src.image, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Image:Url', getValue: (src) => src.image?.url, assert: [{ fn: assertEquals, expect: 'Atom-Logo.com' }] },
			{ name: 'Image:Title', getValue: (src) => src.image?.title, assert: [{ fn: assertEquals, expect: undefined }] },
			{ name: 'Image:Link', getValue: (src) => src.image?.link, assert: [{ fn: assertEquals, expect: 'Atom-Logo.com' }] },
			{ name: 'Image:Height', getValue: (src) => src.image?.height, assert: [{ fn: assertEquals, expect: undefined }] },
			{ name: 'Image:Width', getValue: (src) => src.image?.width, assert: [{ fn: assertEquals, expect: undefined }] },
			{ name: 'Link', getValue: (src) => src.links, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Link:length', getValue: (src) => src.links.length, assert: [{ fn: assertEquals, expect: 1 }] },
			{ name: 'Link:Href', getValue: (src) => src.links[0], assert: [{ fn: assertEquals, expect: 'https://AtomLink.org/' }] },
			{ name: 'Entry', getValue: (src) => src.entries, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },,
			{ name: 'Entry:Length', getValue: (src) => src.entries.length, assert: [{ fn: assertEquals, expect: 3 }] },
			{ name: 'Entry:[0]:Title', getValue: (src) => src.entries[0].title, assert: [{ fn: assertNotEquals, expect: undefined }, { fn: assertNotEquals, expect: null }] },
			{ name: 'Entry:[0]:Title:Type', getValue: (src) => src.entries[0].title?.type, assert: [{ fn: assertEquals, expect: 'xhtml' }] },
			{ name: 'Entry:[0]:Title:Value', getValue: (src) => src.entries[0].title?.value, assert: [{ fn: assertEquals, expect: `<div xmlns="http://www.w3.org/1999/xhtml">HTML&Test Brough to you by<b>Test</b>!</div>` }] },
			{ name: 'Entry:[0]:Link', getValue: (src) => src.entries[0].link, assert: [{ fn: assertEquals, expect: 'https://AtomLink.org/Entry/0/link' }] },
			{ name: 'Entry:[1]:Feedburner:OrigLink', getValue: (src) => src.entries[1].link, assert: [{ fn: assertEquals, expect: 'https://AtomFeedburner.org/Entry/1' }] },
			{ name: 'Entry:[0]:Published', getValue: (src) => src.entries[0].published, assert: [{ fn: assertEquals, expect: new Date('2003-12-13T18:30:02Z') }] },
			{ name: 'Entry:[0]:PublishedRaw', getValue: (src) => src.entries[0].publishedRaw, assert: [{ fn: assertEquals, expect: '2003-12-13T18:30:02Z' }] },
			{ name: 'Entry:[0]:Updated', getValue: (src) => src.entries[0].updated, assert: [{ fn: assertEquals, expect: new Date('2003-12-13T18:30:02Z') }] },
			{ name: 'Entry:[0]:UpdatedRaw', getValue: (src) => src.entries[0].updatedRaw, assert: [{ fn: assertEquals, expect: '2003-12-13T18:30:02Z' }] },
		] as TestDefinition[]
	}
].forEach((workspace) => {
	workspace.tests.forEach((test) => {
		Deno.test(`parseFeed:${workspace.name}:${test.name}`, () => {
			const target = test.getValue(workspace.source);
			test.assert.forEach((x) => x.fn(target, x.expect));
		});
	})
});

interface TestDefinition {
	name: string;
	getValue(arg0: Feed): any;
	assert: [{
		fn: any;
		expect: any;
	}];
}
