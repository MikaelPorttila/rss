import {
	deserializeFeed,
} from "./mod.ts";


(async () => {
	const xml = await Deno.readTextFile(`./samples/${Deno.args[0]}.xml`);
	const { feed } = await deserializeFeed(xml);
	console.log("============ RESULT ============");
	console.log('Result', feed);
})();
