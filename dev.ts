import { parseRss } from './mod.ts';

(async () => {
  const response = await fetch(
    "https://www.reddit.com/r/Deno.rss",
  );
  const xml = await response.text();
  console.log(xml);
  const channel = await parseRss(xml);

  console.log("========== RESULT ============");
  console.log(channel);
})();
