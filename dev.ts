import { deserializeFeed, parseFeed, RSS2, FeedType, Atom } from "./mod.ts";
import { isValidHttpURL } from "./src/util.ts";

const arg0 = Deno.args[0];
let xml: string;
if (isValidHttpURL(arg0)) {
	const response = await fetch(arg0);
	xml = await response.text();
} else {
	xml = await Deno.readTextFile(`./samples/${(arg0 || "rss2")}.xml`);
}

const result = await parseFeed(xml);
console.log("\n", "============ RESULT ============", '\n', result);

/* const result = await deserializeFeed(xml);
console.log("\n", "============ RESULT ============", '\n', result);

switch(result.feedType) {
	case FeedType.Rss2:
		console.log("\n", "============ Items ============", '\n', (result.feed as RSS2).channel.items);
	break;
	case FeedType.Atom:
		console.log("\n", "============ Items ============", '\n', (result.feed as Atom).entries);
	break;
}
 */
