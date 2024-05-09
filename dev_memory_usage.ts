import { config, plot } from "https://deno.land/x/chart/mod.ts";
import { parseFeed } from "./mod.ts";

const arg0 = Deno.args[0];
let xml: string;
if (URL.parse(arg0)) {
  const response = await fetch(arg0);
  xml = await response.text();
} else {
  xml = await Deno.readTextFile(`./samples/${(arg0 || "rss2")}.xml`);
}

const iterations = 10000;
const snapshotCount = 120;

const heapUsageArr = new Array(snapshotCount);
const heapTopArr = new Array(snapshotCount);
const rssArr = new Array(snapshotCount);

const snapshotPos = Math.floor(iterations / snapshotCount);
console.log(`Running ${iterations} iterations, please wait...`);
const initialDenoProcessAndV8MemoryUsage = Deno.memoryUsage();

for (let index = 0; index < iterations; index++) {
  await parseFeed(xml);

  if (index % snapshotPos === 0) {
    const pos = index / snapshotPos;
    if (pos < snapshotCount) {
      heapUsageArr[pos] = (Deno.memoryUsage().heapUsed -
        initialDenoProcessAndV8MemoryUsage.heapUsed) / 1024 / 1024;
      heapTopArr[pos] = (Deno.memoryUsage().heapTotal -
        initialDenoProcessAndV8MemoryUsage.heapTotal) / 1024 / 1024;
      rssArr[pos] =
        (Deno.memoryUsage().rss - initialDenoProcessAndV8MemoryUsage.rss) /
        1024 / 1024;
    }
  }
}

console.log(`\nMemory usage (Heap: Blue, Heap Top: Green, RSS: Red)`);
console.log(
  plot(
    [heapUsageArr, heapTopArr, rssArr],
    { colors: ["blue", "green", "red"], height: 30 } as config,
  ),
);
