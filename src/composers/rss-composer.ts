import { Composer, Attribute } from "./composer.ts";
import { Field, Channel } from "../types/rss.ts";
import { isEmpty } from "./../str.ts";

export class RssComposer implements Composer {
  constructor(private complete: (channel: Channel) => void) {}

  private stack: any[] = [];

  onOpenTag = () => {
    this.stack.push({});
  };

  onCloseTag = (nodeName: string) => {
    let node = this.stack.pop();

    if (this.stack.length === 0) {
      this.complete(node as Channel);
      return;
    }

    const parentNode = this.stack[this.stack.length - 1];
    let isArrayNode = false;
    let isNumber = false;
    let isDate = false;

    let propertyName = nodeName;
    switch (nodeName) {
      case Field.TextInput:
        propertyName = "textInput";
        break;
      case Field.SkipHours:
        propertyName = "skipHours";
        isNumber = true;
        break;
      case Field.SkipDays:
        propertyName = "skipDays";
        isNumber = true;
        break;
      case Field.PubDate:
        propertyName = "pubDate";
        isDate = true;
        break;
      case Field.ManagingEditor:
        propertyName = "managingEditor";
        break;
      case Field.WebMaster:
        propertyName = "webMaster";
        break;
      case Field.LastBuildDate:
        propertyName = "lastBuildDate";
        isDate = true;
        break;
      case Field.Item:
        propertyName = "items";
        isArrayNode = true;
        break;
      case Field.Category:
        propertyName = "categories";
        isArrayNode = true;
        break;
      case Field.isPermaLink:
        propertyName = "isPermaLink";
        break;
      case Field.Ttl:
      case Field.Length:
      case Field.Width:
      case Field.Height:
        isNumber = true;
        break;
    }

    if (!isEmpty(node)) {
      if (isNumber) {
        node = parseInt(node);
      } else if (isDate) {
        node = new Date(node);
      }
    }

    if (isArrayNode) {
      if (!parentNode[propertyName]) {
        parentNode[propertyName] = [];
      }

      parentNode[propertyName].push(node);
    } else {
      parentNode[propertyName] = node;
    }
  };

  onAttribute = (attr: Attribute): void => {
    const node = this.stack[this.stack.length - 1];
    
    switch (attr.name) {
      case Field.isPermaLink:
        node[Field.isPermaLink] = attr.value === "true";
        break;
      default:
        node[attr.name] = attr.value;
        break;
    }
  };

  onValueNode = (text: string): void => {
    this.stack[this.stack.length - 1] = text;
  };
}
