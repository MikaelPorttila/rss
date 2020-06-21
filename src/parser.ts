import { SAXParser } from "../dep.ts";
import { Channel } from "./types/mod.ts";
import { isEmpty } from "./str.ts";
import { Feed } from "./types/atom.ts";
import { resolveAtomField } from "./resolvers/atom-resolver.ts";
import { resolveRssField } from "./resolvers/rss-resolver.ts";

export const parseRss = (input: string): Promise<Channel | Feed> => {
  const worker = new Promise<Channel | Feed>((resolve, reject) => {
    if (isEmpty(input)) {
      reject("[RSS Parser] Input was undefined, null or empty");
      return;
    }

    const stack: any[] = [{}];
    const parser = new SAXParser(false, {
      trim: true,
      lowercase: true,
    });
    let resolveField: (nodeName: string) => [string, boolean, boolean, boolean];

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

        resolve(node);
      }

      const [
        propertyName,
        isArrayNode,
        isNumber,
        isDate,
      ] = resolveField(nodeName);

      if (!isEmpty(node)) {
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
        case FeedType.Atom:
          resolveField = resolveAtomField;
          break;
        case FeedType.Rss:
          resolveField = resolveRssField;
          break;
        default:
          reject(`Type ${node.name} is not supported`);
          break;
      }

      parser.onopentag = onOpenTag;
    };
    parser.write(input).close();
  });

  return worker;
};

enum FeedType {
  Rss = "rss",
  Atom = "feed",
}

interface Attribute {
  name: string;
  value: string;
}

interface OpenTag {
  name: string;
  attributes: {};
  isSelfClosing: boolean;
}
