import { plot, config } from "https://deno.land/x/chart/mod.ts";
import { parseFeed } from "./mod.ts";
import { isValidURL } from "./src/util.ts";

const arg0 = Deno.args[0];
let xml: string;
if (isValidURL(arg0)) {
  const response = await fetch(arg0);
  xml = await response.text();
} else {
  xml = await Deno.readTextFile(`./samples/${(arg0 || "rss2")}.xml`);
}

const iterations = 10000;
const snapshotCount = 120;
const arr = new Array(snapshotCount);
const snapshotPos = Math.floor(iterations/snapshotCount);
console.log(`Running ${iterations} iterations, please wait...`);
const initialDenoProcessAndV8MemoryUsage = Deno.memoryUsage();

for (let index = 0; index < iterations; index++) {
  await parseFeed(xml);

  if (index % snapshotPos === 0) {
    const memoryUsage = (Deno.memoryUsage().heapUsed - initialDenoProcessAndV8MemoryUsage.heapUsed) / 1024 / 1024;
    const pos = index / snapshotPos;
    if(pos < snapshotCount) {
      arr[pos] = memoryUsage;
    }
  }
}

console.log('\nHeap memory usage (MB):')
console.log(plot(arr, { colors: ["blue"], height: 20 } as config));