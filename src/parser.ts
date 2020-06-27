import { SAXParser } from "../dep.ts";
import {
  Feed,
  RSS2,
  RSS1,
  FeedParseType,
  FeedType,
} from "./types/mod.ts";
import {
  resolveAtomField,
  resolveRss2Field,
  resolveRss1Field,
} from "./resolvers/mod.ts";

export const parseRss = (
  input: string,
): Promise<[FeedType, Feed | RSS1 | RSS2]> => {
  const worker = new Promise<[FeedType, Feed | RSS1 | RSS2]>(
    (resolve, reject) => {
      if (!input) {
        reject(new Error("Input was undefined, null or empty"));
        return;
      }

      let feedType: FeedType;
      const stack: any[] = [{}];
      const parser = new SAXParser(false, {
        trim: true,
        lowercase: true,
      });
      let resolveField: (
        nodeName: string,
      ) => [string, boolean, boolean, boolean];

      parser.ontext = (text: string): void => {
        stack[stack.length - 1] = text.trim();
      };

      parser.oncdata = (text: string): void => {
        stack[stack.length - 1] = text.trim();
      };

      const onOpenTag = (node: OpenTag): void => {

        let obj; 
        if(node.isSelfClosing) {
          obj = {...node.attributes};
        } 

        stack.push(obj || {}); 

      };

      parser.onattribute = (attr: Attribute): void => {
        //console.log(attr.name);
        stack[stack.length - 1][attr.name] = attr.value.trim();
      };

      parser.onclosetag = (nodeName: string) => {
        let node = stack.pop();

        if (stack.length === 0) {
          Object.assign(parser, {
            onopentag: undefined,
            onclosetag: undefined,
            ontext: undefined,
            oncdata: undefined,
            onattribute: undefined,
          });

          resolve([feedType, node]);
        }

        const [
          propertyName,
          isArray,
          isNumber,
          isDate,
        ] = resolveField(nodeName);

        if (isNumber) {
          node = parseInt(node);
        } else if (isDate) {
          node = new Date(node);
        }

        const targetNode = stack[stack.length - 1];
        if (isArray) {
          if (!targetNode[propertyName]) {
            targetNode[propertyName] = [];
          }
          targetNode[propertyName].push(node);
        } else {
          targetNode[propertyName] = node;
        }
      };

      parser.onopentag = (node: OpenTag) => {
        switch (node.name) {
          case FeedParseType.Atom:
            feedType = FeedType.Atom;
            resolveField = resolveAtomField;
            break;
          case FeedParseType.Rss2:
            feedType = FeedType.Rss2;
            resolveField = resolveRss2Field;
            break;
          case FeedParseType.Rss1:
            feedType = FeedType.Rss1;
            resolveField = resolveRss1Field;
            break;
          default:
            reject(new Error(`Type ${node.name} is not supported`));
            break;
        }
        parser.onopentag = onOpenTag;
      };

      parser.write(input).close();
    },
  );

  return worker;
};

interface Attribute {
  name: string;
  value: string;
}

interface OpenTag {
  name: string;
  attributes: {};
  isSelfClosing: boolean;
}
