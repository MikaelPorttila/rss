import { ValueField } from "./value-field.ts";

// Based of https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
export interface Slash {
  "slash:department"?: ValueField<string>;
  "slash:section"?: ValueField<string>;
  "slash:comments"?: ValueField<number>;
  "slash:hit_parade"?: ValueField<string>;
}

export enum SlashFields {
  Department = "slash:department",
  Section = "slash:section",
  Comments = "slash:comments",
  HitParade = "slash:hit_parade"
}

export const SlashFieldArray = [
  SlashFields.Department,
  SlashFields.Section,
  SlashFields.Comments,
  SlashFields.HitParade
];
