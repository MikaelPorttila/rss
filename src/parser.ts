import { SAXParser } from "../dep.ts";
import { Channel } from "./types/mod.ts";
import { isEmpty } from "./str.ts";
import { OpenTag, Composer } from "./composers/composer.ts";
import { AtomComposer } from "./composers/atom-composer.ts";
import { RssComposer } from "./composers/rss-composer.ts";
import { Feed } from "./types/atom.ts";

export const parseRss = (input: string): Promise<Channel | Feed> => {
  const worker = new Promise<Channel | Feed>((resolve, reject) => {
    if (isEmpty(input)) {
      reject("[RSS Parser] Input was undefined, null or empty");
      return;
    }

    const xmlParser = new SAXParser(false, { trim: true });
    let composer: Composer;

    const onComplete = (result: Channel | Feed): void => {
      Object.assign(xmlParser, {
        onopentag: undefined,
        onclosetag: undefined,
        ontext: undefined,
        oncdata: undefined,
        onattribute: undefined,
      });

      resolve(result);
    };

    xmlParser.onopentag = (node: OpenTag) => {
      switch (node.name) {
        case FeedType.Atom:
          composer = new AtomComposer(onComplete);
          break;
        case FeedType.Rss:
          composer = new RssComposer(onComplete);
          break;
        default:
          reject(`Type ${node.name} is not supported`);
          break;
      }

      xmlParser.onopentag = composer.onOpenTag;
      xmlParser.onclosetag = composer.onCloseTag;
      xmlParser.ontext = composer.onText;
      xmlParser.oncdata = composer.onCData;
      xmlParser.onattribute = composer.onAttribute;
    };

    xmlParser.onerror = (error: any): void => reject(error);
    xmlParser.write(input).close();
  });

  return worker;
};

enum FeedType {
  Rss = "RSS",
  Atom = "FEED",
}
