import { parseRss } from "./mod.ts";

(async () => {
  const loadAtomFeed = async (): Promise<string> => {
    const response = await fetch("https://www.reddit.com/r/Deno.rss");
    const xml = await response.text();
    return xml;
  };

  const loadRss2Feed = async (): Promise<string> => {
    const response = await fetch(
      "http://static.userland.com/gems/backend/rssTwoExample2.xml",
    );
    const xml = await response.text();
    return xml;
  };

  const loadSample = async (sampleName: string): Promise<string> => {
    const decoder = new TextDecoder("utf-8");
    const result = await Deno.readFile(`./samples/${sampleName}.xml`);
    return decoder.decode(result);
  };

  const xml = await loadSample("rss1");
  /*  const xml = await loadSample('rss2');
  const xml = await loadSample('atom'); */
  const rss = await parseRss(xml);

  console.log("========== RESULT ============");
  console.log(rss);
})();
