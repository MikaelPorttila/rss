import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { DublinCoreFields } from "../types/fields/mod.ts";
import { resolveDublinCoreField } from "./dublin_core_resolver.ts";

[
  {
    name: "",
    expect: {
      isArray: undefined,
      isInt: undefined,
      isFloat: undefined,
      isDate: undefined,
      name: "",
      isHandled: false,
    },
  },
  {
    name: DublinCoreFields.Date,
    expect: {
      isArray: undefined,
      isInt: undefined,
      isFloat: undefined,
      isDate: true,
      name: DublinCoreFields.Date,
      isHandled: true,
    },
  },
  {
    name: DublinCoreFields.Created,
    expect: {
      isArray: undefined,
      isInt: undefined,
      isFloat: undefined,
      isDate: true,
      name: DublinCoreFields.Created,
      isHandled: true,
    },
  },
  {
    name: DublinCoreFields.DateSubmitted,
    expect: {
      isArray: undefined,
      isInt: undefined,
      isFloat: undefined,
      isDate: true,
      name: DublinCoreFields.DateSubmitted,
      isHandled: true,
    },
  },
  {
    name: DublinCoreFields.Copyrighted,
    expect: {
      isArray: undefined,
      isInt: undefined,
      isFloat: undefined,
      isDate: true,
      name: DublinCoreFields.Copyrighted,
      isHandled: true,
    },
  },
  {
    name: DublinCoreFields.DateAccepted,
    expect: {
      isArray: undefined,
      isInt: undefined,
      isFloat: undefined,
      isDate: true,
      name: DublinCoreFields.DateAccepted,
      isHandled: true,
    },
  },
].forEach((test) => {
  Deno.test(`DublinCoreResolver:${test.name}`, () => {
    const result = resolveDublinCoreField(test.name);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.isHandled, test.expect.isHandled, "isHandled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isInt, test.expect.isInt, "isInt");
    assertEquals(result.isFloat, test.expect.isFloat, "isFloat");
    assertEquals(result.name, test.expect.name, "name");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
