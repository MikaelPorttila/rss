import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { SlashFields } from "../types/fields/mod.ts";
import { resolveSlashField } from "./slash-resolver.ts";

[
  {
    propertyName: "",
    expect: {
      isArray: undefined,
      isNumber: undefined,
      isDate: undefined,
      propertyName: '',
      handled: false,
    },
  },
  {
    propertyName: SlashFields.Comments,
    expect: {
      isArray: undefined,
      isNumber: true,
      isDate: undefined,
      propertyName: SlashFields.Comments,
      handled: true,
    },
  },
].forEach((test) => {
  Deno.test(`SlashResolver:${test.propertyName}`, () => {
    const result = resolveSlashField(test.propertyName);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.handled, test.expect.handled, "handled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isInt, test.expect.isNumber, "isNumber");
    assertEquals(result.propertyName, test.expect.propertyName, "propertyName");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
