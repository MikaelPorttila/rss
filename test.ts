import {
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import {
  parseRss,
} from "./mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";

const decoder = new TextDecoder("utf-8");
let cache: any = {};
const loadSample = async (sampleName: string): Promise<string> => {
  let cacheResult = cache[sampleName];
  if (!cacheResult) {
    const result = await Deno.readFile(`./samples/${sampleName}.xml`);
    cacheResult = cache[sampleName] = decoder.decode(result);
  }
  return cacheResult;
};

Deno.test("Parse samples", async () => {
  for await (const entry of walk("./samples/")) {
    if (entry.isFile) {
      const fileContent = await Deno.readFile(`./${entry.path}`);
      const feed = decoder.decode(fileContent);
      try {
        const [feedType, result] = await parseRss(feed);
        assert(() => !!feedType);
        assert(() => !!result);
      } catch (err) {
        throw `Failed to parse ${entry.path}`;
      }
    }
  }
});
