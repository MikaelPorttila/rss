import { assert, assertEquals } from "../test_deps.ts";
import { isValidURL, copyValueFields } from "./util.ts";

Deno.test("is valid HTTP URL", () => {
  assert(isValidURL("https://test.test"));
  assert(isValidURL("http://test.test"));
  assert(!isValidURL("test.com/test"));
  assert(!isValidURL("test/data/test"));
});


Deno.test('CopyValueFields', () => {

	let target = {
		a: undefined,
		b: undefined,
		c: 'cValue'

	};
	let source = {
		a: { value: 'aValue' },
		b: 'bValue',
	};

	copyValueFields(['a', 'b', 'c'], source, target);
	assertEquals(target.a, 'aValue');
	assertEquals(target.b, 'bValue');
	assertEquals(target.c, 'cValue');
});
