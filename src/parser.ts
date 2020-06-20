import { SAXParser } from "../dep.ts";
import { Channel } from "./types/mod.ts";
import { isEmpty } from "./str.ts";
import { Field } from "./types/field.ts";
import { mapFieldName } from "./mapper.ts";

export const parseRss = (input: string): Promise<Channel> => {
  const worker = new Promise<Channel>((resolve, reject) => {
    if (isEmpty(input)) {
      reject("[RSS Parser] Input was undefined, null or empty");
      return;
    }

    let textNodes: string[] = [];
    let skipParse = true;
    const stack: any[] = [];
    const xmlParser = new SAXParser(false, { trim: true });

    xmlParser.onopentag = (node: OpenTag) => {
      if (skipParse) {
        if (node.name == "CHANNEL") {
          skipParse = false;
        } else {
          return;
        }
      }
      stack.push({});
    };

    xmlParser.oncdata = (cdata: string) => {
      if (skipParse) {
        return;
      }

      textNodes.push(cdata);
    };

    xmlParser.onattribute = (attr: Attribute): void => {
      if (skipParse) {
        return;
      }

      const node = stack[stack.length - 1];
      const name = mapFieldName(attr.name);

      switch (attr.name) {
        case Field.isPermaLink:
          node[name] = attr.value === "true";
          break;
        default:
          node[name] = attr.value;
          break;
      }
    };

    xmlParser.ontext = (text: string): void => {
      if (skipParse) {
        return;
      }

      textNodes.push(text);
    };

    xmlParser.onclosetag = (nodeName: string): void => {
      if (skipParse) {
        return;
      }

      let node = stack.pop();

      if (nodeName === "CHANNEL") {
        resolve(node as Channel);
        skipParse = true;
      } else {
        if (textNodes.length !== 0) {
          const value = textNodes.join().trim();
          switch (nodeName) {
            case Field.LastBuildDate:
            case Field.PubDate:
              node = new Date(value);
              break;
            case Field.Ttl:
            case Field.SkipDays:
            case Field.SkipHours:
            case Field.Length:
            case Field.Width:
            case Field.Height:
              node = parseInt(value);
              break;
            default:
              node = value;
              break;
          }

          textNodes = [];
        }

        const name = mapFieldName(nodeName);
        const prevNode = stack[stack.length - 1];

        switch (nodeName) {
          case Field.Category:
          case Field.Item:
            if (!prevNode[name]) {
              prevNode[name] = [];
            }

            prevNode[name].push(node);
            break;
          default:
            prevNode[name] = node;
            break;
        }

        /* if (prevNode[name]) {
          if (!Array.isArray(prevNode[name])) {
            prevNode[name] = [prevNode[name]];
          }

          prevNode[name].push(node);
        } else {
          prevNode[name] = node;
        } */
      }
    };

    xmlParser.onerror = (error: any): void => reject(error);
    xmlParser.write(input).close();
  });

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
