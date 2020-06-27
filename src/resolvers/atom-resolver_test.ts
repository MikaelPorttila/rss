import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { resolveAtomField } from "./atom-resolver.ts";

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
