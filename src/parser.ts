import { SAXParser } from "./dep.ts";
import { Channel } from "./types/mod.ts";
import { isEmpty } from "./str.ts";

export const parse = (input: string): Promise<Channel | null> => {
  const worker = new Promise<Channel | null>((resolve, reject) => {
    let channel: Channel;
    let textToAddOnNodeClose: string[] = [];
    let skipParse = true;
    const stack: any[] = [];

    const xmlParser = new SAXParser(false, {});

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
      textToAddOnNodeClose.push(cdata.trim());
    };

    xmlParser.onattribute = (attribute: Attribute): void => {
      if (skipParse) {
        return;
      }
    };

    xmlParser.ontext = (text: string): void => {
      if (skipParse) {
        return;
      }

      textToAddOnNodeClose.push(text.trim());
    };

    xmlParser.onclosetag = (nodeName: string): void => {
      if (skipParse) {
        return;
      }

      let node = stack.pop();

      if (textToAddOnNodeClose.length !== 0) {
        if (Object.keys(node).length === 0) {
          node = textToAddOnNodeClose.reduce(
            (res, text) => `${res}${text}`,
            "",
          );
        }

        textToAddOnNodeClose = [];
      }

      if (nodeName === "CHANNEL") {
        skipParse = true;
        channel = node as Channel;
        //TODO: Try to call xmlParser.close();
      } else {
        const name = getNodeName(nodeName);
        const prevNode = stack[stack.length - 1];

        if (prevNode[name]) {
          if (!Array.isArray(prevNode[name])) {
            prevNode[name] = [prevNode[name]];
          }

          prevNode[name].push(node);
        } else {
          prevNode[name] = node;
        }
      }
    };

    xmlParser.onerror = (error: any): void => {
      reject(error);
    };

    xmlParser.onend = (): void => {
      resolve(channel);
    };

    xmlParser.write(input).close();
  });

  return worker;
};

const getNodeName = (name: string): string => {
  let result = name;

  if (!isEmpty(name)) {
    result = name;
    switch (name) {
      case "TEXTINPUT":
        result = "textInput";
        break;
      case "SKIPHOURS":
        result = "skipHours";
        break;
      case "SKIPDAYS":
        result = "skipDays";
        break;
      case "PUBDATE":
        result = "pubDate";
        break;
      case "MANAGINGEDITOR":
        result = "managingEditor";
        break;
      case "WEBMASTER":
        result = "webMaster";
        break;
      case "LASTBUILDDATE":
        result = "lastBuildDate";
        break;
      case "ITEM":
        result = "items";
        break;
      case "CATEGORY":
        result = "categories";
        break;
      default:
        result = name.toLowerCase();
        break;
    }
  }

  return result;
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
