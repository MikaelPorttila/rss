export * from "./types/mod.ts";
import { Channel } from "./types/mod.ts";
import { parse, parse2 } from "./parser.ts";

export const parseRss = (str: string): Promise<Channel> => {
  const parseWorker = new Promise<Channel>((resolve, reject) =>  parse2(str));
  return parseWorker;
};


