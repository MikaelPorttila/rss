import { Composer, OpenTag, Attribute } from './composer.ts';
import { Field, Channel } from '../types/rss.ts';
import {isEmpty} from './../str.ts';

export class RssComposer implements Composer {
  
  constructor(private complete: (channel: Channel) => void) {}

  private stack: any[] = [];
  private textNode: string | null = null;

  onOpenTag = (node: OpenTag) => {
    this.stack.push({});
  };

  onCloseTag = (nodeName: string) => {
    let node = this.stack.pop();

    if(this.stack.length === 0){
      this.complete(node as any);
      return;
    }

    if(this.textNode != null) {
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

  onCData = (text: string): void => {
    this.textNode = text;
  };

  onAttribute = (attr: Attribute) => {
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
  onText = (text: string) => {
    this.textNode = text;
  };

  mapFieldName = (name: string): string => {
    let result = name;

    if(isEmpty(name)) {
      return '';
    }
  
    switch (name) {
      case Field.TextInput:
        result = "textInput";
        break;
      case Field.SkipHours:
        result = "skipHours";
        break;
      case Field.SkipDays:
        result = "skipDays";
        break;
      case Field.PubDate:
        result = "pubDate";
        break;
      case Field.ManagingEditor:
        result = "managingEditor";
        break;
      case Field.WebMaster:
        result = "webMaster";
        break;
      case Field.LastBuildDate:
        result = "lastBuildDate";
        break;
      case Field.Item:
        result = "items";
        break;
      case Field.Category:
        result = "categories";
        break;
      case Field.isPermaLink:
        result = "isPermaLink";
        break;
      default:
        result = name.toLowerCase();
        break;
    }
  
    return result;
  };
}