import {
  assert,
  assertEquals,
  assertThrowsAsync,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { parseRss } from "./parser.ts";
import { FeedType, Feed, RSS2, RSS1 } from "../mod.ts";

const decoder = new TextDecoder("utf-8");

[undefined, null, ""].forEach((input: any) => {
  Deno.test(`Parse bad input: ${input}`, () => {
    assertThrowsAsync(() => parseRss(input));
  });
});

Deno.test(`Parser unsupported format`, () => {
  assertThrowsAsync(() => parseRss("<test></test>"));
});

Deno.test('Parse RSS2', async (): Promise<void> => {
  const binaryString = await Deno.readFile('./samples/rss2.xml');
  const fileContent = decoder.decode(binaryString);
  const [feedType, result] = (await parseRss(fileContent)) as [FeedType, RSS2];

  assertEquals(feedType, FeedType.Rss2);
  assert(!!result, 'Parser returned undefined');
  
  const { items, pubDate, ttl, copyright, link } = result.channel;
  assertNotEquals(ttl, undefined, 'Missing ttl');
  assertEquals(typeof(ttl), typeof(2), 'ttl was not parsed into number');
  assertEquals(typeof(pubDate), typeof(new Date()));
  assert(!!copyright, 'Channel is missing copyright value');
  assert(!!link, 'Channel is missing link value');
  
  assert(items.length > 0, 'Channel is missing items');
  for (const item of items) {
    assert(!!item.title, 'Item is missing title value');
    assert(!!item.description, 'Item is missing description value');
    assert(!!item.description, 'Item is missing description value');
    assert(!!item.link, 'Item is missing link value');
    assertEquals(typeof(item.pubDate), typeof(new Date()), 'Item.pubDate was not converted into date');
  }
});

Deno.test('Parse ATOM', async (): Promise<void> => {
  const binaryString = await Deno.readFile('./samples/atom.xml');
  const fileContent = decoder.decode(binaryString);
  const [feedType, result] = (await parseRss(fileContent)) as [FeedType, Feed];

  assert(!!result, 'Feed was undefined');
  assert(!!result.id, 'Feed is missing id value');
  assert(!!result.title, 'Feed is missing title value');
  assert(!!result.icon, 'Feed is missing icon value');
  assert(!!result.entries, 'Feed is missing entries value');
  assert(!!result.categories, 'Feed is missing categories value');
  assertEquals(typeof(result.updated), typeof(new Date), 'Feed is missing icon value');

  assert(!!result.author.email, 'Feed Author is missing email value');
  assert(!!result.author.name, 'Feed Author is missing name value');
  assert(!!result.author.uri, 'Feed Author is missing uri value');

  for(const category of result.categories) {
    assert(!!category.term, 'Category is missing term value');
  }

  for(const entry of result.entries) {
    assert(!!entry.author, 'Entry is missing author value');
    assert(!!entry.title, 'Entry is missing title value');
    assert(!!entry.published, 'Entry is missing published value');
    assert(!!entry.updated, 'Entry is missing updated value');
    assert(!!entry.id, 'Entry is missing id value');
    assert(!!entry.content, 'Entry is missing content value');
    assert(!!entry.links, 'Entry is missing links value');
    assert(!!entry.contributors, 'Entry is missing contributors value');
    assert(!!entry.summary, 'Entry is missing summary value');
    assert(!!entry.rights, 'Entry is missing rights value');
    assert(!!entry.categories, 'Entry is missing categories value');
    assert(!!entry.source, 'Entry is missing source value');
    assert(!!entry.source.id, 'Entry source is missing id value');
    assert(!!entry.source.title, 'Entry source is missing title value');
    assert(!!entry.source.updated, 'Entry source is missing updated value');
    assert(!!entry.rights.type, 'Entry rights is missing type value');
    assert(!!entry.rights.value, 'Entry rights is missing value');
    assert(!!entry.author.email, 'Entry Author is missing email value');
    assert(!!entry.author.name, 'Entry Author is missing name value');
    assert(!!entry.author.uri, 'Entry Author is missing uri value');
  }
});
