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
        reject("Input was undefined, null or empty");
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
      const onOpenTag = (): void => {
        stack.push({});
      };
      parser.onattribute = (attr: Attribute): void => {
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
          isArrayNode,
          isNumber,
          isDate,
        ] = resolveField(nodeName);

        if (node) {
          if (isNumber) {
            node = parseInt(node);
          } else if (isDate) {
            node = new Date(node);
          }
        }

        const targetNode = stack[stack.length - 1];
        if (isArrayNode) {
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
            reject(`Type ${node.name} is not supported`);
            break;
        }
        parser.onopentag = onOpenTag;
      };

      // TODO: Work with streams instead of loading the whole input at once.
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
