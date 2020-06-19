import {
  assertEquals,
  assertThrowsAsync,
  assert,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { parseRss } from "./mod.ts";

let cache: string = "";
const getRssFeed = async (): Promise<string> => {
  if (cache === "") {
    const response = await fetch(
      "http://static.userland.com/gems/backend/rssTwoExample2.xml",
    );
    cache = await response.text();
  }

  return Promise.resolve(cache);
};

Deno.test("Parser error handling: undefined input", async () => {
  await assertThrowsAsync(async () => {
    await parseRss(undefined as any);
  });
});

Deno.test("Parser error handling: null input", async () => {
  await assertThrowsAsync(async () => {
    await parseRss(null as any);
  });
});

Deno.test("Parser error handling: empty input", async () => {
  await assertThrowsAsync(async () => {
    await parseRss("");
  });
});

Deno.test("Parser", async () => {
  const xml = await getRssFeed();
  const result = await parseRss(xml);

  assertNotEquals(result, undefined);
  assertNotEquals(result, null);
});

Deno.test("Parser number handling", async () => {
  const xml = await getRssFeed();
  const result = await parseRss(xml);

  assertEquals(typeof result.ttl, typeof 1);
});

Deno.test("Parser nested fields", async () => {
  const xml = await getRssFeed();
  const result = await parseRss(xml);

  assertEquals(typeof result.items, typeof []);
  assert(() => result.items === undefined, "items field is undefined");
  assert(() => result.items.length > 0, "items field is empty");
});
