import { assert, assertEquals } from "../../test_deps.ts";
import { isAtomCDataField, resolveAtomField } from "./atom-resolver.ts";
import { AtomFields } from "./types/atom-fields.ts";

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

  [AtomFields.Category, AtomFields.Link, AtomFields.Entry].forEach((field) => {
    const [propertyName, isArray, isNumber, isDate] = resolveAtomField(field);

    assertEquals(true, isArray, `isArray should be true for field ${field}`);
    assertEquals(
      false,
      isNumber,
      `isNumber should be false for field ${field}`,
    );
    assertEquals(false, isDate, `isDate should be false for field ${field}`);
  });

  [AtomFields.Updated, AtomFields.Published].forEach((field) => {
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

[
  AtomFields.Title,
  AtomFields.Summary,
  AtomFields.Content,
  AtomFields.Rights,
].forEach((field) => {
  Deno.test(`AtomResolver:CData:${field}`, () => {
    assert(isAtomCDataField(field));
  });
});

[
  AtomFields.Id,
  AtomFields.Icon,
  AtomFields.Updated,
  AtomFields.Link,
  AtomFields.Entry,
  AtomFields.Category,
  AtomFields.Type,
  AtomFields.Href,
  AtomFields.Rel,
  AtomFields.Author,
  AtomFields.Contributor,
  AtomFields.Source,
  AtomFields.Src,
  AtomFields.Value,
  AtomFields.Name,
  AtomFields.Published,
  AtomFields.Email,
].forEach((field) =>
  Deno.test(`AtomResolver:NonCData:${field}`, () => {
    assert(!isAtomCDataField(field));
  })
);
