import { 
  parseRss, 
  Feed, 
  FeedType 
} from "./mod.ts";

const readFile = async (fileName: string): Promise<string> => {
  const decoder = new TextDecoder("utf-8");
  const binaryString = await Deno.readFile(fileName);
  const result = decoder.decode(binaryString);
  return result;
}

(async () => {
  const xml = await readFile('./samples/atom.xml');
  const [feedType, result] = (await parseRss(xml)) as [FeedType, Feed];

  console.log("============ RESULT ============");
  console.log(result);
})();
