import { assert, assertEquals } from "../../test_deps.ts";
import { AtomFields } from "../types/fields/atom_fields.ts";
import { isAtomCDataField, resolveAtomField } from "./atom_resolver.ts";

Deno.test("Atom Resolver", () => {
  [undefined, null].forEach((field: any) => {
    const result = resolveAtomField(field);

    assert(result.name === field, `propertyName should be null`);
    assertEquals(
      false,
      result.isArray,
      `isArray should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isInt,
      `isNumber should be false for field: ${field}`,
    );
    assertEquals(
      false,
      result.isDate,
      `isDate should be false for field ${field}`,
    );
  });

  [AtomFields.Category, AtomFields.Link, AtomFields.Entry].forEach((field) => {
    const result = resolveAtomField(field);

    assertEquals(
      true,
      result.isArray,
      `isArray should be true for field ${field}`,
    );
    assertEquals(
      false,
      result.isInt,
      `isNumber should be false for field ${field}`,
    );
    assertEquals(
      false,
      result.isDate,
      `isDate should be false for field ${field}`,
    );
  });

  [AtomFields.Updated, AtomFields.Published].forEach((field) => {
    const result = resolveAtomField(field);

    assertEquals(
      false,
      result.isArray,
      `isArray should be false for field ${field}`,
    );
    assertEquals(
      false,
      result.isInt,
      `isNumber should be false for field ${field}`,
    );
    assertEquals(
      true,
      result.isDate,
      `isDate should be true for field ${field}`,
    );
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
