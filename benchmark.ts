import { bench, runBenchmarks } from "./test_deps.ts";
import { parseFeed } from "./mod.ts";

[
  {
    name: "RSS1",
    source: await Deno.readTextFile(`./samples/rss1.xml`),
  },
  {
    name: "RSS2",
    source: await Deno.readTextFile(`./samples/rss2.xml`),
  },
  {
    name: "ATOM",
    source: await Deno.readTextFile(`./samples/atom.xml`),
  },
].forEach((feed) => {
  bench({
    name: `ParseFeed ${feed.name}, Chars: ${feed.source.length}`,
    runs: 10000,
    func: async (watch) => {
      watch.start();
      await parseFeed(feed.source);
      watch.stop();
    },
  });
});

await runBenchmarks();
