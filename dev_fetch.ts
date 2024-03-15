import { parseFeed } from "./mod.ts";

[
  "http://rss.slashdot.org/Slashdot/slashdotMain",
  "https://www.fz.se/feeds/forum",
  "https://developers.googleblog.com/feeds/posts/default",
  "https://medium.com/feed/invironment/tagged/food",
].forEach(async (feedUrl, index, arr) => {
  const response = await fetch(feedUrl);
  const xml = await response.text();
  await parseFeed(xml);
  console.log(`✔ Parsed ${feedUrl}`);
});
