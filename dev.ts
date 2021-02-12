import { 
  deserializeFeed, 
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
  const xml = await readFile(`./samples/${Deno.args[0]}.xml`);
  const [feedType, result] = await deserializeFeed(xml);

  console.log("============ RESULT ============");
  console.log('Result', result);
})();
