import { assertEquals, assertNotEquals } from "../../test_deps.ts";
import { SlashFields } from "../types/fields/mod.ts";
import { resolveSlashField } from "./slash-resolver.ts";

[
  {
    name: "",
    expect: {
      name: "",
      isArray: false,
      isInt: false,
      isFloat: false,
      isDate: false,
      isHandled: false,
    },
  },
  {
    name: SlashFields.Comments,
    expect: {
      name: SlashFields.Comments,
      isArray: false,
      isHandled: true,
      isInt: true,
      isFloat: false,
      isDate: false,
    },
  },
].forEach((test) => {
  Deno.test(`SlashResolver:${test.name}`, () => {
    const result = resolveSlashField(test.name);
    assertNotEquals(result, undefined);
    assertNotEquals(result, null);
    assertEquals(result.name, test.expect.name, "name");
    assertEquals(result.isHandled, test.expect.isHandled, "isHandled");
    assertEquals(result.isArray, test.expect.isArray, "isArray");
    assertEquals(result.isInt, test.expect.isInt, "isInt");
    assertEquals(result.isFloat, test.expect.isFloat, "isFloat");
    assertEquals(result.isDate, test.expect.isDate, "isDate");
  });
});
