import { bench, runBenchmarks } from "./test_deps.ts";
import { deserializeFeed } from "./mod.ts";

(async () => {
	let cache: { [id: string]: string } = {};
	const loadSample = (sampleName: string): string => {
		let cacheResult = cache[sampleName];
		if (!cacheResult) {
			const result = 	Deno.readTextFileSync(`./samples/${sampleName}.xml`);
			cacheResult = cache[sampleName] = result
		}
		return cacheResult;
	};

	const samples = ["rss1", "rss2", "atom"];
	samples.forEach((feedSample) => {
		const sample = loadSample(feedSample);
		bench({
			name: `Deserialize ${feedSample}`,
			runs: 10000,
			func(b): void {
				b.start();
				deserializeFeed(sample).then(() => b.stop());
			},
		});
	});

	runBenchmarks();
})();
