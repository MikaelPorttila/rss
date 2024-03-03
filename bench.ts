import { parseFeed } from "./mod.ts";

Deno.bench('Parse RSS1', async (b) => {
  let source =  await Deno.readTextFile(`./samples/rss1.xml`);
  b.start();
  await parseFeed(source);
  b.end();
  source = '';
});

Deno.bench('Parse RSS2', async (b) => {
  let source =  await Deno.readTextFile(`./samples/rss2.xml`);
  b.start();
  await parseFeed(source);
  b.end();
  source = '';
});

Deno.bench('Parse ATOM', async (b) => {
  let source =  await Deno.readTextFile(`./samples/atom.xml`);
  b.start();
  await parseFeed(source);
  b.end();
  source = '';
});
