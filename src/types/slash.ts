import { ValueField } from "./value-field.ts";

// Based of https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
export interface SlashValueFields {
  "slash:department"?: ValueField<string>;
  "slash:section"?: ValueField<string>;
  "slash:comments"?: ValueField<number>;
  "slash:hit_parade"?: ValueField<string>;
}

export interface Slash {
  "slash:department"?: string;
  "slash:section"?: string;
  "slash:comments"?: number;
  "slash:hit_parade"?: string;
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
