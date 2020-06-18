import { xmlParser, SAXParser } from "./dep.ts";
import { Channel, Item } from "./types/mod.ts";

export const parse2 = (input: string): Promise<Channel | null> => {

    const worker = new Promise<Channel | null>((resolve, reject) => {
        const channel = {} as Channel;

        const result = {}; 
        const stack: any[] = [result];

        const xmlParser = new SAXParser(false, {});

        xmlParser.opentagstart = (e:any) => {
            //console.log('opentagstart', e);
        }

        xmlParser.ontext = function (t: any) {
            const parentNode = stack[stack.length - 1];
            const name = parentNode.name;
            const parentParentNode = stack[stack.length - 2];
            if(parentParentNode) {
                console.log('stack length', stack.length);
                console.log('parentParentNode', parentParentNode, t);
                stack.pop();
                parentParentNode[parentNode.name] = t;
            }
        };

        xmlParser.onopentag = (node: OpenTag) => {
            //console.log('onopentag', node);
            const parrentNode = stack[stack.length - 1]; 

            const newNode = {
                name: node.name,
                debugIsSelf: node.isSelfClosing
            };

            switch(node.name) {
                case 'ITEM':
                    if(!parrentNode['items']) {
                        parrentNode.items = [];
                    }
                    parrentNode.items.push(newNode);
                    console.log(node);
                    break;
                default:
                    parrentNode[node.name] = newNode;
                break;
            }

            stack.push(newNode);
        }

        xmlParser.onattribute = (attribute: Attribute) => {
            const currentNode = stack[stack.length - 1];
            currentNode[attribute.name] = attribute.value;
        }

        xmlParser.onclosetag = (node: any) => {
            stack.pop();
        }

        xmlParser.onend = () => {
            console.log(result);
            resolve(channel);
        }

        xmlParser.write(input).close();
    });
    
    return worker;
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


export const parse = (input: string): Channel | null => {
  if (!input || input === "") {
    return null;
  }

  try {
    const xmlDocument = xmlParser.default(input);
    if (!xmlDocument) {
      return null;
    }

    const channelNode = xmlDocument.root?.children[0];
    const channel = composeChannelFromNodes(channelNode.children);
    console.log(channel);
    //console.log(channelNode);

    return {} as Channel;
  } catch {
    // Todo: throw some usable exception.
    return null;
  }
};

const composeChannelFromNodes = (nodes: Node[]): Channel => {
  const channel = {} as Channel;
  const items: Item[] = [];

  for (const node of nodes) {
    switch (node.name) {
      case "title":
        channel.title = node.content;
        break;
      case "link":
        channel.link = node.content;
        break;
      case "description":
        channel.description = node.content;
        break;
      case "language":
        channel.language = node.content;
        break;
      case "copyright":
        channel.copyright = node.content;
        break;
      case "lastBuildDate":
        if (node.content && node.content !== "") {
          // Todo: Fix better date error handling.
          channel.lastBuildDate = new Date(node.content);
        }
        break;
      case "docs":
        channel.docs = node.content;
        break;
      case "generator":
        channel.generator = node.content;
        break;
      case "webMaster":
        channel.webMaster = node.content;
        break;
      case "managingEditor":
        channel.managingEditor = node.content;
        break;
      case "item":
        if (node.children?.length !== 0) {
          const item = composeItemFromNodes(node.children);
          items.push(item);
        }
        break;
      case "ttl":
        if (node.content && node.content !== "") {
          channel.ttl = parseInt(node.content);
        }
        break;
    }
  }
  channel.items = items;

  return channel;
};

const composeItemFromNodes = (nodes: Node[]) => {
  const item = {} as Item;
  for (const node of nodes) {
    switch (node.name) {
      case "title":
        item.title = node.content;
        break;
      case "link":
        item.link = node.content;
        break;
      case "pubDate":
        if (node.content && node.content !== "") {
          // Todo: Fix better date error handling.
          item.pubDate = new Date(node.content);
        }
        break;
      case "guid":
        item.guid = node.content;
        break;
      case "comments":
        item.comments = node.content;
        break;
      case "description":
        item.description = node.content;
        break;
    }
  }

  return item;
};

interface Node {
  name: string;
  content: string;
  children: Node[];
}
