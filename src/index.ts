/* export * from "./types/mod.ts";
import { Channel } from "./types/mod.ts";
import { parse } from "./parser.ts";

export const parseRss = (str: string): Promise<Channel> => {
  const parseWorker = new Promise<Channel>(async (resolve, reject) => {
    const result = await parse(str);
    resolve(result as Channel);
  });
  return parseWorker;
};
 */
