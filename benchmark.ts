import { bench, runBenchmarks } from "./test_deps.ts";
import { deserializeFeed } from "./mod.ts";

(async () => {
  let cache: { [id: string]: string } = {};
  const loadSample = (sampleName: string): string => {
    let cacheResult = cache[sampleName];
    if (!cacheResult) {
      const decoder = new TextDecoder("utf-8");
      const result = Deno.readFileSync(`./samples/${sampleName}.xml`);
      cacheResult = cache[sampleName] = decoder.decode(result);
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
