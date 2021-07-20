import { InternalAtom } from "./internal-atom.ts";
import { InternalRSS1 } from "./internal-rss1.ts";
import { InternalRSS2 } from "./internal-rss2.ts";
import { Atom, RSS1, RSS2 } from "./mod.ts";

export interface FeedParseResult {
	feedType: Atom | RSS1 | RSS2;
	data: InternalAtom | InternalRSS1 | InternalRSS2;
}
