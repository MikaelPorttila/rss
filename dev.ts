import { parseRss } from './mod.ts';

(async () => {
  const response = await fetch(
    "http://static.userland.com/gems/backend/rssTwoExample2.xml",
  );
  const xml = await response.text();
  const channel = await parseRss(xml);

  console.log("========== RESULT ============");
  console.log(channel);
})();
