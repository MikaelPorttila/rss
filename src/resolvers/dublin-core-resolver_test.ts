import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { DublinCoreFields } from "../types/fields/mod.ts";
import { resolveDublinCoreField } from "./dublin-core-resolver.ts";

[
  {
    propertyName: "",
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: undefined,
      propertyName: '',
      handled: false,
    },
  },
  {
    propertyName: DublinCoreFields.Date,
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: true,
      propertyName: DublinCoreFields.Date,
      handled: true,
    },
  },
  {
    propertyName: DublinCoreFields.Created,
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: true,
      propertyName: DublinCoreFields.Created,
      handled: true,
    },
  },
  {
    propertyName: DublinCoreFields.DateSubmitted,
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: true,
      propertyName: DublinCoreFields.DateSubmitted,
      handled: true,
    },
  },
  {
    propertyName: DublinCoreFields.Copyrighted,
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: true,
      propertyName: DublinCoreFields.Copyrighted,
      handled: true,
    },
  },
  {
    propertyName: DublinCoreFields.DateAccepted,
    expect: {
      isArray: undefined,
      isInt: undefined,
			isFloat: undefined,
      isDate: true,
      propertyName: DublinCoreFields.DateAccepted,
      handled: true,
    },
  },
].forEach((test) => {
  Deno.test(`DublinCoreResolver:${test.propertyName}`, () => {
    const result = resolveDublinCoreField(test.propertyName);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.handled, test.expect.handled, "handled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isInt, test.expect.isInt, "isInt");
		assertEquals(result.isFloat, test.expect.isFloat, "isFloat");
    assertEquals(result.propertyName, test.expect.propertyName, "propertyName");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
