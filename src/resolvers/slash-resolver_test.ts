import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { SlashFields } from "../types/slash.ts";
import { resolveSlashField } from "./slash-resolver.ts";

[
  {
    propertyName: "",
    expect: {
      isArray: undefined,
      isNumber: undefined,
      isDate: undefined,
      newName: undefined,
      handled: false,
    },
  },
  {
    propertyName: SlashFields.Comments,
    expect: {
      isArray: undefined,
      isNumber: true,
      isDate: undefined,
      newName: undefined,
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
    assertEquals(result.isNumber, test.expect.isNumber, "isNumber");
    assertEquals(result.newName, test.expect.newName, "newName");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
