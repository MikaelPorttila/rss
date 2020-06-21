import { runBenchmarks, bench } from "https://deno.land/std/testing/bench.ts";
import { parseRss } from "./mod.ts";

(async () => {
  const rss = await fetch(
    "https://lorem-rss.herokuapp.com/feed?length=20",
  ).then((res) => res.text());
  const atom = await fetch("https://www.reddit.com/r/Deno.rss")
    .then((res) => res.text());

  bench({
    name: "Parse RSS Feed",
    runs: 10000,
    func(b): void {
      b.start();
      parseRss(rss).then(() => b.stop());
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
