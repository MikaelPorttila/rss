import { runBenchmarks, bench } from "https://deno.land/std/testing/bench.ts";
import { parseRss } from './mod.ts';

(async () => {
  const response = await fetch(
    "https://lorem-rss.herokuapp.com/feed?length=20",
  );
  const xml = await response.text();

  bench({
    name: "Parse RSS Feed",
    runs: 10000,
    func(b): void {
      b.start();
      parseRss(xml).then(() => b.stop())
    }
  });
  
  runBenchmarks();
})();

// Benchmark results: i7-9750H 2.60GHz, 32GB 2667 MHz
// 2020-06-20: 10000 runs avg: 1.3092ms