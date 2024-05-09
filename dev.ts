import { parseFeed } from "./mod.ts";

const arg0 = Deno.args[0];
let xml: string;
if (URL.parse(arg0)) {
  const response = await fetch(arg0);
  xml = await response.text();
} else {
  xml = await Deno.readTextFile(`./samples/${(arg0 || "rss2")}.xml`);
}

const feed = await parseFeed(xml);
console.log("\n", "⭐============ RESULT ============⭐", "\n", feed);
