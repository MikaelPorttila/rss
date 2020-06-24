import {
  assert,
} from "https://deno.land/std/testing/asserts.ts";
import {
  parseRss,
} from "./mod.ts";

const decoder = new TextDecoder("utf-8");
for (const fileInfo of Deno.readDirSync('./samples/')) {
  if (fileInfo.isFile) {
    Deno.test(`Parse ${fileInfo.name}`, async () => {
      const filePath = `./samples/${fileInfo.name}`;
      const fileContent = await Deno.readFile(filePath);
      const feed = decoder.decode(fileContent);
      try {
        const [feedType, result] = await parseRss(feed);
        assert(() => !!feedType);
        assert(() => !!result);
      } catch (err) {
        throw `Failed to parse ${fileInfo.name}`;
      }
    });
  }
}
