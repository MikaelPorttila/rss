import { SAXParser } from "./dep.ts";
import { Channel } from "./types/mod.ts";
import { isEmpty } from "./str.ts";
import { RssField } from "./types/rss-field.ts";

export const parseRss = (input: string): Promise<Channel> => {
  const dateFields = [RssField.PubDate, RssField.LastBuildDate];
  const numberFields = [RssField.Ttl, RssField.SkipHours, RssField.Length];

  const worker = new Promise<Channel>((resolve, reject) => {
    let textToAddOnNodeClose: string[] = [];
    let skipParse = true;
    const stack: any[] = [];

    const xmlParser = new SAXParser(false, {
      trim: true,
    });

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
      textToAddOnNodeClose.push(cdata);
    };

    xmlParser.onattribute = (attribute: Attribute): void => {
      if (skipParse) {
        return;
      }
      // TODO: extend object with these attr.
    };

    xmlParser.ontext = (text: string): void => {
      if (skipParse) {
        return;
      }

      textToAddOnNodeClose.push(text);
    };

    xmlParser.onclosetag = (nodeName: string): void => {
      if (skipParse) {
        return;
      }

      let node = stack.pop();

      if (textToAddOnNodeClose.length !== 0) {
        if (Object.keys(node).length === 0) {
          const valueField = textToAddOnNodeClose.reduce(
            (res, text) => res + text,
            "",
          );

          if (isEmpty(valueField)) {
            node = "";
          } else {
            if (dateFields.some((name) => name === nodeName)) {
              node = new Date(valueField);
            } else if (numberFields.some((name) => name === nodeName)) {
              node = parseInt(valueField);
            } else {
              node = valueField;
            }
          }
        }

        textToAddOnNodeClose = [];
      }

      if (nodeName === "CHANNEL") {
        resolve(node as Channel);
        skipParse = true;
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
      case RssField.TextInput:
        result = "textInput";
        break;
      case RssField.SkipHours:
        result = "skipHours";
        break;
      case RssField.SkipDays:
        result = "skipDays";
        break;
      case RssField.PubDate:
        result = "pubDate";
        break;
      case RssField.ManagingEditor:
        result = "managingEditor";
        break;
      case RssField.WebMaster:
        result = "webMaster";
        break;
      case RssField.LastBuildDate:
        result = "lastBuildDate";
        break;
      case RssField.Item:
        result = "items";
        break;
      case RssField.Category:
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
