import { assert, assertEquals } from "../../test_deps.ts";
import { resolveAtomField, isAtomCDataField } from "./atom-resolver.ts";

Deno.test("Atom Resolver", () => {
	[undefined, null].forEach((field: any) => {
		const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

		assert(propertyName === field, `propertyName should be null`);
		assertEquals(false, isArray, `isArray should be false for field: ${field}`);
		assertEquals(
			false,
			isNumber,
			`isNumber should be false for field: ${field}`,
		);
		assertEquals(false, isDate, `isDate should be false for field ${field}`);
	});

	["category", "link", "entry"].forEach((field) => {
		const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

		assertEquals(true, isArray, `isArray should be true for field ${field}`);
		assertEquals(
			false,
			isNumber,
			`isNumber should be false for field ${field}`,
		);
		assertEquals(false, isDate, `isDate should be false for field ${field}`);
	});

	["updated", "published"].forEach((field) => {
		const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

		assertEquals(false, isArray, `isArray should be false for field ${field}`);
		assertEquals(
			false,
			isNumber,
			`isNumber should be false for field ${field}`,
		);
		assertEquals(true, isDate, `isDate should be true for field ${field}`);
	});
});

Deno.test("Atom CData field checker", () => {
	["title", "summary", "content", "rights"].forEach((field) => {
		assert(isAtomCDataField(field), `${field} was not marked as CData field`);
	});

	[
		"id",
		"icon",
		"updated",
		"link",
		"entry",
		"category",
		"type",
		"href",
		"rel",
		"author",
		"contributor",
		"source",
		"src",
		"value",
		"name",
		"published",
		"email",
	].forEach((field) => {
		assert(!isAtomCDataField(field), `${field} was marked as CData field`);
	});
});
