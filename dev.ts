import { deserializeFeed, DublinCore, MediaRss, parseFeed } from "./mod.ts";
import { isValidURL } from "./src/util.ts";

const arg0 = Deno.args[0];
let xml: string;
if (isValidURL(arg0)) {
  const response = await fetch(arg0);
  xml = await response.text();
} else {
  xml = await Deno.readTextFile(`./samples/${(arg0 || "rss2")}.xml`);
}

const feed = await parseFeed(xml);
console.log("\n", "⭐============ RESULT ============⭐", "\n", feed);
