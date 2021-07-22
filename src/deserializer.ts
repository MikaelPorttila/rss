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
import { toLegacyRss1, toLegacyRss2 } from "./mapper-legacy.ts";
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

    const { data, feedType } = await parse(input);
    const result = toFeed(feedType, data) as Feed;
    resolve(result);
  });

/**
 * @deprecated The method should not be used, please use the parseFeed method instead.
 */
export const deserializeFeed = (async (
	input: string,
  options?: Options
) => {
	console.warn('RSS: deserializeFeed is deprecated, please use parseFeed instead.');
	const { data, feedType } = await parse(input);

	let legacyFeed;
	switch(feedType) {
		case FeedType.Rss1:
			legacyFeed = toLegacyRss1(data) as any;
			break;
		case FeedType.Rss2:
			legacyFeed = toLegacyRss2(data) as any;
			break;
		default:
			legacyFeed = data;
			break;
	}

	const result: DeserializationResult<Atom | RSS1 | RSS2 | JsonFeed> & {
		originalFeedType?: FeedType;
	} = {
		feed: options?.outputJsonFeed ? toJsonFeed(feedType, legacyFeed) : legacyFeed,
		feedType: options?.outputJsonFeed ? FeedType.JsonFeed : feedType,
	};

	if (options?.outputJsonFeed) {
		result.originalFeedType = feedType;
	}

	return result;

}) as {
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

const parse = (input: string) =>
  new Promise<{feedType: FeedType, data: any}>(
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

      parser.oncdata = parser.ontext = (text: string): void => {
        if (cDataActive) {
          cDataBuilder += text;
        } else {
					stack[stack.length - 1].value = text.trim();
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

        const newNode = attributeNames.reduce((builder, attrName) => {
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

        stack.push(newNode);
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
            oncdata: undefined
          });

					const result = {
						feedType: feedType,
						data: node
					};
          resolve(result);
          return;
        }

				const targetNode = stack[stack.length - 1];
				const [
          propertyName,
          isArray,
          isNumber,
          isDate,
        ] = resolveField(nodeName);

        if (cDataActive) {
          node.value = cDataBuilder;
					targetNode[propertyName] = node;
          cDataBuilder = "";
          cDataActive = false;
          cDataLevel = 0;
          return;
        }

        if (isNumber) {
          node.value = parseInt(node.value);
        } else if (isDate) {
          targetNode[propertyName + "Raw"] = { value: node.value };
          node.value = new Date(node.value);
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

      parser
				.write(input)
				.close()
				.flush();
    },
  );

interface OpenTag {
  name: string;
  attributes: {};
  isSelfClosing: boolean;
}
