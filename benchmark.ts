import { bench, runBenchmarks } from "./test_deps.ts";
import { deserializeFeed, parseFeed } from "./mod.ts";

[
	{
		name: 'RSS1',
		source: Deno.readTextFileSync(`./samples/rss1.xml`)
	},
	{
		name: 'RSS2',
		source: Deno.readTextFileSync(`./samples/rss2.xml`)
	},
	{
		name: 'ATOM',
		source: Deno.readTextFileSync(`./samples/atom.xml`)
	}
].forEach((feed) => {
	bench({
		name: `Deserialize ${feed.name}`,
		runs: 10000,
		func(b): void {
			b.start();
			deserializeFeed(feed.source).then(() => b.stop());
		},
	});

	if (feed.name !== 'RSS1') {
		bench({
			name: `parseFeed ${feed.name}`,
			runs: 10000,
			func(c): void {
				c.start();
				parseFeed(feed.source).then(() => c.stop());
			},
		});
	}
});

await runBenchmarks();
