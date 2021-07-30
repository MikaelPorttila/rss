import { ValueField } from "./value-field.ts";

// Based of https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
export interface SlashValueFields {
  [SlashFields.Department]?: ValueField<string>;
  [SlashFields.Section]?: ValueField<string>;
  [SlashFields.Comments]?: ValueField<number>;
  [SlashFields.HitParade]?: ValueField<string>;
}

export interface Slash {
  [SlashFields.Department]?: string;
  [SlashFields.Section]?: string;
  [SlashFields.Comments]?: number;
  [SlashFields.HitParade]?: string;
}

export enum SlashFields {
  Department = "slash:department",
  Section = "slash:section",
  Comments = "slash:comments",
  HitParade = "slash:hit_parade",
}

export const SlashFieldArray = [
  SlashFields.Department,
  SlashFields.Section,
  SlashFields.Comments,
  SlashFields.HitParade,
];
