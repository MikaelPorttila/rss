import { deserializeFeed, parseFeed, RSS2 } from "./mod.ts";

import { isValidHttpURL } from "./src/util.ts";

(async () => {
  console.log("\n============ RESULT ============");
  const arg0 = Deno.args[0];
  let xml;
  if (isValidHttpURL(arg0)) {
    const response = await fetch(arg0);
    xml = await response.text();
  } else {
    const sampleFileName = arg0 || "rss2";
    xml = await Deno.readTextFile(`./samples/${sampleFileName}.xml`);
  }

  const feed = await parseFeed(xml);
  console.log(feed);
})();
