import { parseRss } from "./mod.ts";

(async () => {
  const decoder = new TextDecoder("utf-8");
  const fileByteArray = await Deno.readFile(`./samples/rss2.xml`);
  const xml = decoder.decode(fileByteArray);
  const rss = await parseRss(xml);

  console.log("============ RESULT ============");
  console.log(rss);
})();
