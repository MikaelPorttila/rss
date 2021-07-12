import {
	assert,
	assertEquals,
	assertNotEquals,
	assertThrowsAsync,
} from "../test_deps.ts";
import { deserializeFeed } from "./deserializer.ts";
import { FeedType } from "../mod.ts";
import type { DeserializationResult, Atom, Options, RSS2 } from "../mod.ts";

const decoder = new TextDecoder("utf-8");

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
		const xml = await Deno.readTextFile("./samples/rss2.xml");

		const result1 = await deserializeFeed(xml);
		const result2 = await deserializeFeed(xml, { outputJsonFeed: true });
		const result3 = await deserializeFeed(xml, { outputJsonFeed: false });

		const options: Options = {};
		const result4 = await deserializeFeed(xml, options);
	}
});

Deno.test("Deserialize RSS2", async (): Promise<void> => {
	const binaryString = await Deno.readFile("./samples/rss2.xml");
	const fileContent = decoder.decode(binaryString);
	const { feed, feedType } =
		(await deserializeFeed(fileContent)) as DeserializationResult<RSS2>;

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
	const binaryString = await Deno.readFile("./samples/rss2.xml");
	const fileContent = decoder.decode(binaryString);
	const { feed, feedType } = await deserializeFeed(fileContent, {
		outputJsonFeed: true,
	});

	assert(!!feed, "Result was undefined");
	assertEquals(feedType, FeedType.JsonFeed);
});

Deno.test("Deserialize ATOM", async (): Promise<void> => {
	const binaryString = await Deno.readFile("./samples/atom.xml");
	const fileContent = decoder.decode(binaryString);
	const { feed, feedType } =
		(await deserializeFeed(fileContent)) as DeserializationResult<Atom>;

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
	const binaryString = await Deno.readFile("./samples/atom.xml");
	const fileContent = decoder.decode(binaryString);
	const { feed, feedType } = await deserializeFeed(fileContent, {
		outputJsonFeed: true,
	});

	assert(!!feed, "Result was undefined");
	assertEquals(feedType, FeedType.JsonFeed);
	assertEquals(
		feed.items[0].title,
		'<div xmlns="http://www.w3.org/1999/xhtml">AT&T bought<b>by SBC</b>!</div>',
		"Title was not mapped correctly",
	);
});

Deno.test("Returns correct original feedType with outputJsonFeed option", async () => {
	const atom = await Deno.readTextFile("./samples/atom.xml");
	const atomJsonFeed = await deserializeFeed(atom, { outputJsonFeed: true });
	assertEquals(FeedType.Atom, atomJsonFeed.originalFeedType);

	const rss2 = await Deno.readTextFile("./samples/rss2.xml");
	const rssJsonFeed = await deserializeFeed(rss2, { outputJsonFeed: true });
	assertEquals(FeedType.Rss2, rssJsonFeed.originalFeedType);
});
