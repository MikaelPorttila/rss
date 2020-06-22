import { runBenchmarks, bench } from "https://deno.land/std/testing/bench.ts";
import { parseRss } from "./mod.ts";

(async () => {
  let cache: any = {};
  const loadSample = async (sampleName: string): Promise<string> => {
    let cacheResult = cache[sampleName];
    if (!cacheResult) {
      const decoder = new TextDecoder("utf-8");
      const result = await Deno.readFile(`./samples/${sampleName}.xml`);
      cacheResult = cache[sampleName] = decoder.decode(result);
    }
    return cacheResult;
  };

  /*  const rss = await fetch(
    "https://lorem-rss.herokuapp.com/feed?length=20",
  ).then((res) => res.text());
  const atom = await fetch("https://www.reddit.com/r/Deno.rss")
    .then((res) => res.text()); */

  const rss1 = await loadSample("rss1");
  const rss2 = await loadSample("rss2");
  const atom = await loadSample("atom");

  bench({
    name: "Parse RSS 1.0 Feed",
    runs: 10000,
    func(b): void {
      b.start();
      parseRss(rss1).then(() => b.stop());
    },
  });

  bench({
    name: "Parse RSS 2.0 Feed",
    runs: 10000,
    func(b): void {
      b.start();
      parseRss(rss2).then(() => b.stop());
    },
  });

  bench({
    name: "Parse Atom Feed",
    runs: 10000,
    func(b): void {
      b.start();
      parseRss(atom).then(() => b.stop());
    },
  });

  runBenchmarks();
})();
