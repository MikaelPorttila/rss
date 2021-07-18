import {
  assertEquals,
  assertNotEquals,
} from "../../test_deps.ts";
import { DublinCoreFields } from "../types/dublin-core.ts";
import { resolveDublinCoreField } from "./dublin-core-resolver.ts";

[
	{ propertyName: '', expect: { isArray: undefined, isNumber: undefined, isDate: undefined, newName: undefined, handled: undefined } },
	{ propertyName: DublinCoreFields.Date, expect: { isArray: undefined, isNumber: undefined, isDate: true, newName: undefined, handled: true } },
	{ propertyName: DublinCoreFields.Created, expect: { isArray: undefined, isNumber: undefined, isDate: true, newName: undefined, handled: true } },
	{ propertyName: DublinCoreFields.DateSubmitted, expect: { isArray: undefined, isNumber: undefined, isDate: true, newName: undefined, handled: true } },
	{ propertyName: DublinCoreFields.Copyrighted, expect: { isArray: undefined, isNumber: undefined, isDate: true, newName: undefined, handled: true } },
	{ propertyName: DublinCoreFields.DateAccepted, expect: { isArray: undefined, isNumber: undefined, isDate: true, newName: undefined, handled: true } }
].forEach((test) => {
	Deno.test(`DublinCoreResolver:${test.propertyName}`, () => {
		const result = resolveDublinCoreField(test.propertyName);
		assertNotEquals(result, undefined);
		assertNotEquals(result, null);
		assertEquals(result.handled, test.expect.handled, 'handled');
		assertEquals(result.isArray, test.expect.isArray, 'isArray');
		assertEquals(result.isNumber, test.expect.isNumber, 'isNumber');
		assertEquals(result.newName, test.expect.newName, 'newName');
		assertEquals(result.isDate, test.expect.isDate, 'isDate');
	});
});
