import {
  assertEquals,
  assertThrowsAsync,
  assert,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import {
  parseRss,
  FeedType,
  RSS2,
} from "./mod.ts";

let cache: any = {};
const loadSample = async (sampleName: string): Promise<string> => {
  let cacheResult = cache[sampleName];
  if (!cacheResult) {
    const decoder = new TextDecoder("utf-8");
    const result = await Deno.readFile(`./samples/${sampleName}.xml`);
    cacheResult = cache[sampleName] = decoder.decode(result);
  }
  return cacheResult;
};

Deno.test("Parser RSS, error handling: undefined input", async () => {
  await assertThrowsAsync(async () => {
    await parseRss(undefined as any);
  });
});

Deno.test("Parser RSS, error handling: null input", async () => {
  await assertThrowsAsync(async () => {
    await parseRss(null as any);
  });
});

Deno.test("Parser RSS, error handling: empty input", async () => {
  await assertThrowsAsync(async () => {
    await parseRss("");
  });
});

Deno.test("Parser RSS", async () => {
  const xml = await loadSample("rss2");
  const result = await parseRss(xml);

  assertNotEquals(result, undefined);
  assertNotEquals(result, null);
});

Deno.test("Parser RSS number handling", async () => {
  const xml = await loadSample("rss2");
  const [feedType, result] = await parseRss(xml) as [FeedType.Rss2, RSS2];
  const { channel } = result;

  assertEquals(typeof channel.ttl, typeof 1);
});

Deno.test("Parser RSS nested fields", async () => {
  const xml = await loadSample("rss2");
  const [feedType, result] = await parseRss(xml) as [FeedType.Rss2, RSS2];
  const { channel } = result;

  assertEquals(typeof channel.items, typeof []);
  assert(() => channel.items === undefined, "items field is undefined");
  assert(() => channel.items.length > 0, "items field is empty");
});
