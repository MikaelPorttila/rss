import { SAXParser } from "../deps.ts";
import type {
  Atom,
  DeserializationResult,
  Feed,
  JsonFeed,
  RSS1,
  RSS2,
} from "./types/mod.ts";
import { FeedParseType, FeedType } from "./types/mod.ts";

import {
  isAtomCDataField,
  resolveAtomField,
  resolveRss1Field,
  resolveRss2Field,
} from "./resolvers/mod.ts";
import { toFeed, toJsonFeed } from "./mapper.ts";
export interface Options {
  outputJsonFeed?: boolean;
}

export const parseFeed = (
  input: string,
): Promise<Feed> =>
  new Promise<Feed>(async (resolve, reject) => {
    if (!input) {
      reject(new Error("Input was undefined, null or empty"));
      return;
    }

    const { feed, feedType } = await deserializeFeed(input);
    const result = toFeed(feedType, feed) as Feed;
    resolve(result);
  });

export const deserializeFeed = ((
  input: string,
  options?: Options,
) =>
  new Promise<DeserializationResult<Atom | RSS1 | RSS2 | JsonFeed>>(
    (resolve, reject) => {
      if (!input) {
        reject(new Error("Input was undefined, null or empty"));
        return;
      }

      //	Handle invalid feed documents by converting the description field to CDATA.
      input = input
        .replaceAll(
          /<description>(?!(\s*<!\[CDATA))/g,
          `<description><![CDATA[`,
        )
        .replaceAll(/(?<!\]\]>\s*)<\/description>/g, `]]></description>`);

      let cDataLevel: number;
      let cDataBuilder: string;
      let cDataActive: boolean;
      let feedType: FeedType;
      const stack: any[] = [{}];
      const parser = new SAXParser(false, {
        trim: true,
        lowercase: true,
      });

      let resolveField: (
        nodeName: string,
      ) => [string, boolean, boolean, boolean];

      let isCDataField: (nodeName: string) => boolean;

      parser.ontext = (text: string): void => {
        if (cDataActive) {
          cDataBuilder += text;
        } else {
          stack[stack.length - 1] = text.trim();
        }
      };

      parser.oncdata = (text: string): void => {
        if (cDataActive) {
          cDataBuilder += text;
        } else {
          stack[stack.length - 1] = text.trim();
        }
      };

      const onOpenTag = (node: OpenTag): void => {
        const attributeNames = Object.keys(node.attributes);

        if (cDataActive) {
          const attributes = attributeNames
            .map((key) => `${key}="${(node.attributes as any)[key]}"`)
            .join(" ")
            .trim();

          if (attributes.length) {
            cDataBuilder += `<${node.name} ${attributes}>`;
          } else {
            cDataBuilder += `<${node.name}>`;
          }

          cDataLevel++;
          return;
        }

        if (isCDataField(node.name)) {
          cDataActive = true;
          cDataBuilder = "";
          cDataLevel = 0;
        }

        const attributes = attributeNames.reduce((builder, attrName) => {
          const [
            attributeName,
            isArray,
            isNumber,
            isDate,
          ] = resolveField(attrName);
          const val = (node.attributes as any)[attributeName];
          if (isNumber) {
            builder[attrName] = parseInt(val);
          } else if (isDate) {
            builder[attrName + "Raw"] = val;
            builder[attrName] = new Date(val);
          } else {
            builder[attrName] = val;
          }

          return builder;
        }, {} as any);

        stack.push(attributes);
      };

      parser.onattribute = (attr: Attribute): void => {
        if (cDataActive) {
          return;
        }

        if (!resolveField) {
          return;
        }

        let attributeName, value, node;

        try {
          const [
            attributeName,
            isArray,
            isNumber,
            isDate,
          ] = resolveField(attr.name);

          node = stack[stack.length - 1];
          value = attr.value.trim();

          if (isNumber) {
            node[attributeName] = parseInt(value);
          } else if (isDate) {
            node[attributeName + "Raw"] = value;
            node[attributeName] = new Date(value);
          } else {
            node[attributeName] = value;
          }
        } catch (ex) {
          console.error(
            `Failed to assign property ${attributeName} with the value ${value} on ${node}, ex: ${ex}`,
          );
        }
      };

      parser.onclosetag = (nodeName: string) => {
        if (cDataActive && cDataLevel) {
          cDataBuilder += `</${nodeName}>`;
          cDataLevel--;
          return;
        }

        let node = stack.pop();

        if (stack.length === 0) {
          Object.assign(parser, {
            onopentag: undefined,
            onclosetag: undefined,
            ontext: undefined,
            oncdata: undefined,
            onattribute: undefined,
          });

          const result: DeserializationResult<Atom | RSS1 | RSS2 | JsonFeed> & {
            originalFeedType?: FeedType;
          } = {
            feed: options?.outputJsonFeed ? toJsonFeed(feedType, node) : node,
            feedType: options?.outputJsonFeed ? FeedType.JsonFeed : feedType,
          };

          if (options?.outputJsonFeed) {
            result.originalFeedType = feedType;
          }

          resolve(result);
          return;
        }

        if (cDataActive) {
          node["value"] = cDataBuilder;
          stack[stack.length - 1][nodeName] = node;
          cDataBuilder = "";
          cDataActive = false;
          cDataLevel = 0;
          return;
        }

        const [
          propertyName,
          isArray,
          isNumber,
          isDate,
        ] = resolveField(nodeName);

        const targetNode = stack[stack.length - 1];

        if (isNumber) {
          node = parseInt(node);
        } else if (isDate) {
          targetNode[propertyName + "Raw"] = node;
          node = new Date(node);
        }

        if (isArray) {
          if (!targetNode[propertyName]) {
            targetNode[propertyName] = [node];
          } else {
            targetNode[propertyName].push(node);
          }
        } else {
          const isEmpty = (typeof node === "object") &&
            Object.keys(node).length === 0 &&
            !(node instanceof Date);
          try {
            if (!isEmpty) {
              targetNode[propertyName] = node;
            }
          } catch {
            console.error(
              `Failed to add property ${propertyName} on node`,
              targetNode,
            );
          }
        }
      };

      parser.onopentag = (node: OpenTag) => {
        switch (node.name) {
          case FeedParseType.Atom:
            feedType = FeedType.Atom;
            isCDataField = isAtomCDataField;
            resolveField = resolveAtomField;
            break;
          case FeedParseType.Rss2:
            feedType = FeedType.Rss2;
            isCDataField = () => false;
            resolveField = resolveRss2Field;
            break;
          case FeedParseType.Rss1:
            feedType = FeedType.Rss1;
            isCDataField = () => false;
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
  )) as {
    (input: string): Promise<DeserializationResult<Atom | RSS1 | RSS2>>;
    (
      input: string,
      options: Options & { outputJsonFeed: false },
    ): Promise<DeserializationResult<Atom | RSS1 | RSS2>>;
    (
      input: string,
      options: Options & { outputJsonFeed: true },
    ): Promise<
      DeserializationResult<JsonFeed> & { originalFeedType: FeedType }
    >;
    (
      input: string,
      options?: Options,
    ): Promise<DeserializationResult<Atom | JsonFeed | RSS1 | RSS2>>;
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
