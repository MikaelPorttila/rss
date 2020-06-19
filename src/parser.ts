import { SAXParser } from "./dep.ts";
import { Channel, Item, Image } from "./types/mod.ts";
import { isEmpty } from "./str.ts";

export const parse = (input: string): Promise<Channel | null> => {
  const worker = new Promise<Channel | null>((resolve, reject) => {
    let channel = {} as Channel;

    const stack: any[] = [];
    let textToAddOnNodeClose: string[] = [];

    const xmlParser = new SAXParser(false, {});

    let skipParse = true;
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

    /* xmlParser.onopencdata = (cdata: any) => {
      console.log('cdata', cdata);
    }; */

    /* xmlParser.onclosecdata = (cdata: any) => {
      // nothing for now
      console.log('cdataclose', cdata);
    } */

    xmlParser.oncdata = (cdata: string) => {
      textToAddOnNodeClose.push(cdata.trim());
    }

    xmlParser.onattribute = (attribute: Attribute) => {
      if (skipParse) {
        return;
      }
    };

    xmlParser.ontext = function (text: string) {
      if (skipParse) {
        return;
      }

      textToAddOnNodeClose.push(text.trim());
    };

    xmlParser.onclosetag = (nodeName: string) => {
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

    xmlParser.onerror = (error: any) => {
      reject(error);
    };

    xmlParser.onend = () => {
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
