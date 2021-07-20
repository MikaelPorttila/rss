import { deserializeFeed, parseFeed, RSS2 } from "./mod.ts";
import { SAXParser } from './deps.ts';

import { isValidHttpURL } from "./src/util.ts";

const arg0 = Deno.args[0];
let xml: string;
if (isValidHttpURL(arg0)) {
	const response = await fetch(arg0);
	xml = await response.text();
} else {
	xml = await Deno.readTextFile(`./samples/${(arg0 || "rss2")}.xml`);
}

const feed = await deserializeFeed(xml);
console.log("\n", "============ RESULT ============", '\n', feed);


/* xml = xml
.replaceAll(
	/<description>(?!(\s*<!\[CDATA))/g,
	`<description><![CDATA[`,
)
.replaceAll(/(?<!\]\]>\s*)<\/description>/g, `]]></description>`);

const parser = new SAXParser(false, {
	trim: true,
	lowercase: true
});
parser.onopentag = (node: any) => {
	console.log('onopentag:\t', node);
};
parser.onopentagstart = (node: any) => {
	console.log('onopentagstart:\t', node);
};
parser.onattribute = (attr:any, attr2: any) => {
	console.log('attr:\t', attr, attr2);
};
parser.ontext = () => {
	console.log('TEXT-node');
};
parser.oncdata = () => {
	console.log('CData-node');
};
parser.onclosetag = (nodeName: string) => {
	console.log('onclosetag:\t', nodeName);
};

parser.write(xml); */
