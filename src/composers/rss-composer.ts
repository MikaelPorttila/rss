import { Composer, OpenTag, Attribute } from "./composer.ts";
import { Field, Channel } from "../types/rss.ts";
import { isEmpty } from "./../str.ts";

export class RssComposer implements Composer {
  constructor(private complete: (channel: Channel) => void) {}

  private stack: any[] = [];
  private textNode: string | null = null;

  onOpenTag = () => {
    this.stack.push({});
  };

  onCloseTag = (nodeName: string) => {
    let node = this.stack.pop();

    if (this.stack.length === 0) {
      this.complete(node as Channel);
      return;
    }

    if (this.textNode != null) {
      const value = this.textNode.trim();
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

      this.textNode = null;
    }

    const name = this.mapFieldName(nodeName);
    const prevNode = this.stack[this.stack.length - 1];

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
  };

  onAttribute = (attr: Attribute): void => {
    const node = this.stack[this.stack.length - 1];
    const name = this.mapFieldName(attr.name);

    switch (attr.name) {
      case Field.isPermaLink:
        node[name] = attr.value === "true";
        break;
      default:
        node[name] = attr.value;
        break;
    }
  };

  onCData = (text: string): void => {
    this.textNode = text;
  };

  onText = (text: string): void => {
    this.textNode = text;
  };

  mapFieldName = (name: string): string => {
    if (isEmpty(name)) {
      return "";
    }

    switch (name) {
      case Field.TextInput:
        return "textInput";
      case Field.SkipHours:
        return "skipHours";
      case Field.SkipDays:
        return "skipDays";
      case Field.PubDate:
        return "pubDate";
      case Field.ManagingEditor:
        return "managingEditor";
      case Field.WebMaster:
        return "webMaster";
      case Field.LastBuildDate:
        return "lastBuildDate";
      case Field.Item:
        return "items";
      case Field.Category:
        return "categories";
      case Field.isPermaLink:
        return "isPermaLink";
      default:
        return name.toLowerCase();
    }
  };
}
