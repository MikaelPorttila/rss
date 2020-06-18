import { parseRss } from "./src/index.ts";

(async () => {
  const response = await fetch(
    //"http://static.userland.com/gems/backend/rssTwoExample2.xml",
    "https://www.fz.se/feeds/nyheter",
  );
  const xml = await response.text();
  //console.log(xml);
  const channel = await parseRss(xml);


  //console.log(channel);
})();
