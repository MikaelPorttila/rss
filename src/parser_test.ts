import {
  assert,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { parseRss } from "./parser.ts";

const decoder = new TextDecoder("utf-8");
for (const fileInfo of Deno.readDirSync("./samples")) {
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

[undefined, null, ""].forEach((input: any) => {
  Deno.test(`Parse input: ${input}`, () => {
    assertThrowsAsync(() => parseRss(input));
  });
});

Deno.test(`Parser should reject input which doesn't match feed types`, () => {
  assertThrowsAsync(() => parseRss("<test></test>"));
});
