import { ValueField } from "./value-field.ts";

// Based on https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
export interface DublinCoreValueFields {
  [DublinCoreFields.Contributor]?: ValueField<string>[];
  [DublinCoreFields.Coverage]?: ValueField<string>;
  [DublinCoreFields.Creator]?: ValueField<string>[];
  [DublinCoreFields.Date]?: ValueField<Date>;
  [DublinCoreFields.DateRaw]?: ValueField<string>;
  [DublinCoreFields.Description]?: ValueField<string>;
  [DublinCoreFields.Format]?: ValueField<string>;
  [DublinCoreFields.Language]?: ValueField<string>;
  [DublinCoreFields.Identifier]?: ValueField<string>;
  [DublinCoreFields.Publisher]?: ValueField<string>;
  [DublinCoreFields.Relation]?: ValueField<string>;
  [DublinCoreFields.Rights]?: ValueField<string>;
  [DublinCoreFields.Source]?: ValueField<string>;
  [DublinCoreFields.Subject]?: ValueField<string>;
  [DublinCoreFields.Title]?: ValueField<string>;
  [DublinCoreFields.Type]?: ValueField<string>;
  [DublinCoreFields.Abstract]?: ValueField<string>;
  [DublinCoreFields.AccessRights]?: ValueField<string>;
  [DublinCoreFields.AccrualMethod]?: ValueField<string>;
  [DublinCoreFields.AccrualPeriodicity]?: ValueField<string>;
  [DublinCoreFields.AccrualPolicy]?: ValueField<string>;
  [DublinCoreFields.Alternative]?: ValueField<string>;
  [DublinCoreFields.Audience]?: ValueField<string>;
  [DublinCoreFields.Available]?: ValueField<string>;
  [DublinCoreFields.BibliographicCitation]?: ValueField<string>;
  [DublinCoreFields.ConformsTo]?: ValueField<string>;
  [DublinCoreFields.Created]?: ValueField<Date>;
  [DublinCoreFields.CreatedRaw]?: ValueField<string>;
  [DublinCoreFields.DateAccepted]?: ValueField<Date>;
  [DublinCoreFields.DateAcceptedRaw]?: ValueField<string>;
  [DublinCoreFields.Copyrighted]?: ValueField<Date>;
  [DublinCoreFields.CopyrightedRaw]?: ValueField<string>;
  [DublinCoreFields.DateSubmitted]?: ValueField<Date>;
  [DublinCoreFields.DateSubmittedRaw]?: ValueField<string>;
  [DublinCoreFields.EducationLevel]?: ValueField<string>;
  [DublinCoreFields.Extent]?: ValueField<string>;
  [DublinCoreFields.HasFormat]?: ValueField<string>;
  [DublinCoreFields.HasPart]?: ValueField<string>;
  [DublinCoreFields.HasVersion]?: ValueField<string>;
  [DublinCoreFields.InstructionalMethod]?: ValueField<string>;
  [DublinCoreFields.IsFormatOf]?: ValueField<string>;
  [DublinCoreFields.IsPartOf]?: ValueField<string>;
  [DublinCoreFields.IsReferencedBy]?: ValueField<string>;
  [DublinCoreFields.IsReplacedBy]?: ValueField<string>;
  [DublinCoreFields.IsRequiredBy]?: ValueField<string>;
  [DublinCoreFields.Issued]?: ValueField<string>;
  [DublinCoreFields.IsVersionOf]?: ValueField<string>;
  [DublinCoreFields.License]?: ValueField<string>;
  [DublinCoreFields.Mediator]?: ValueField<string>;
  [DublinCoreFields.Medium]?: ValueField<string>;
  [DublinCoreFields.Modified]?: ValueField<Date>;
  [DublinCoreFields.ModifiedRaw]?: ValueField<string>;
  [DublinCoreFields.Provenance]?: ValueField<string>;
  [DublinCoreFields.References]?: ValueField<string>;
  [DublinCoreFields.Replaces]?: ValueField<string>;
  [DublinCoreFields.Requires]?: ValueField<string>;
  [DublinCoreFields.RightsHolder]?: ValueField<string>;
  [DublinCoreFields.Spatial]?: ValueField<string>;
  [DublinCoreFields.TableOfContents]?: ValueField<string>;
  [DublinCoreFields.Tempora]?: ValueField<string>;
  [DublinCoreFields.Valid]?: ValueField<Date>[];
  [DublinCoreFields.Box]?: ValueField<string>;
  [DublinCoreFields.DCMIType]?: ValueField<string>[];
  [DublinCoreFields.DDC]?: ValueField<string>;
  [DublinCoreFields.IMT]?: ValueField<string>;
  [DublinCoreFields.ISO3166]?: ValueField<string>;
  [DublinCoreFields.ISO6392]?: ValueField<string>;
  [DublinCoreFields.LLC]?: ValueField<string>;
  [DublinCoreFields.LCSH]?: ValueField<string>;
  [DublinCoreFields.MESH]?: ValueField<string>;
  [DublinCoreFields.NLM]?: ValueField<string>;
  [DublinCoreFields.Period]?: ValueField<string>;
  [DublinCoreFields.Point]?: ValueField<string>;
  [DublinCoreFields.RFC1766]?: ValueField<string>;
  [DublinCoreFields.RFC3066]?: ValueField<string>;
  [DublinCoreFields.TGN]?: ValueField<string>[];
  [DublinCoreFields.UDC]?: ValueField<string>;
  [DublinCoreFields.URI]?: ValueField<string>;
  [DublinCoreFields.W3CDTF]?: ValueField<string>;
}

export interface DublinCore {
  [DublinCoreFields.Contributor]?: string[];
  [DublinCoreFields.Coverage]?: string;
  [DublinCoreFields.Creator]?: string[];
  [DublinCoreFields.Date]?: Date;
  [DublinCoreFields.DateRaw]?: string;
  [DublinCoreFields.Description]?: string;
  [DublinCoreFields.Format]?: string;
  [DublinCoreFields.Language]?: string;
  [DublinCoreFields.Identifier]?: string;
  [DublinCoreFields.Publisher]?: string;
  [DublinCoreFields.Relation]?: string;
  [DublinCoreFields.Rights]?: string;
  [DublinCoreFields.Source]?: string;
  [DublinCoreFields.Subject]?: string;
  [DublinCoreFields.Title]?: string;
  [DublinCoreFields.Type]?: string;
  [DublinCoreFields.Abstract]?: string;
  [DublinCoreFields.AccessRights]?: string;
  [DublinCoreFields.AccrualMethod]?: string;
  [DublinCoreFields.AccrualPeriodicity]?: string;
  [DublinCoreFields.AccrualPolicy]?: string;
  [DublinCoreFields.Alternative]?: string;
  [DublinCoreFields.Audience]?: string;
  [DublinCoreFields.Available]?: string;
  [DublinCoreFields.BibliographicCitation]?: string;
  [DublinCoreFields.ConformsTo]?: string;
  [DublinCoreFields.Created]?: Date;
  [DublinCoreFields.CreatedRaw]?: string;
  [DublinCoreFields.DateAccepted]?: Date;
  [DublinCoreFields.DateAcceptedRaw]?: string;
  [DublinCoreFields.Copyrighted]?: Date;
  [DublinCoreFields.CopyrightedRaw]?: string;
  [DublinCoreFields.DateSubmitted]?: Date;
  [DublinCoreFields.DateSubmittedRaw]?: string;
  [DublinCoreFields.EducationLevel]?: string;
  [DublinCoreFields.Extent]?: string;
  [DublinCoreFields.HasFormat]?: string;
  [DublinCoreFields.HasPart]?: string;
  [DublinCoreFields.HasVersion]?: string;
  [DublinCoreFields.InstructionalMethod]?: string;
  [DublinCoreFields.IsFormatOf]?: string;
  [DublinCoreFields.IsPartOf]?: string;
  [DublinCoreFields.IsReferencedBy]?: string;
  [DublinCoreFields.IsReplacedBy]?: string;
  [DublinCoreFields.IsRequiredBy]?: string;
  [DublinCoreFields.Issued]?: string;
  [DublinCoreFields.IsVersionOf]?: string;
  [DublinCoreFields.License]?: string;
  [DublinCoreFields.Mediator]?: string;
  [DublinCoreFields.Medium]?: string;
  [DublinCoreFields.Modified]?: Date;
  [DublinCoreFields.ModifiedRaw]?: string;
  [DublinCoreFields.Provenance]?: string;
  [DublinCoreFields.References]?: string;
  [DublinCoreFields.Replaces]?: string;
  [DublinCoreFields.Requires]?: string;
  [DublinCoreFields.RightsHolder]?: string;
  [DublinCoreFields.Spatial]?: string;
  [DublinCoreFields.TableOfContents]?: string;
  [DublinCoreFields.Tempora]?: string;
	[DublinCoreFields.Valid]?: Date[];
  [DublinCoreFields.Box]?: string;
  [DublinCoreFields.DCMIType]?: string[];
  [DublinCoreFields.DDC]?: string;
  [DublinCoreFields.IMT]?: string;
  [DublinCoreFields.ISO3166]?: string;
  [DublinCoreFields.ISO6392]?: string;
  [DublinCoreFields.LLC]?: string;
  [DublinCoreFields.LCSH]?: string;
  [DublinCoreFields.MESH]?: string;
  [DublinCoreFields.NLM]?: string;
  [DublinCoreFields.Period]?: string;
  [DublinCoreFields.Point]?: string;
  [DublinCoreFields.RFC1766]?: string;
  [DublinCoreFields.RFC3066]?: string;
  [DublinCoreFields.TGN]?: string[];
  [DublinCoreFields.UDC]?: string;
  [DublinCoreFields.URI]?: string;
  [DublinCoreFields.W3CDTF]?: string;
}

export enum DublinCoreFields {
  Contributor = "dc:contributor",
  Coverage = "dc:coverage",
  Creator = "dc:creator",
  Date = "dc:date",
  DateRaw = "dc:dateRaw",
  Description = "dc:description",
  Format = "dc:format",
  Language = "dc:language",
  Identifier = "dc:identifier",
  Publisher = "dc:publisher",
  Relation = "dc:relation",
  Rights = "dc:rights",
  Source = "dc:source",
  Subject = "dc:subject",
  Title = "dc:title",
  Type = "dc:type",
  Abstract = "dc:abstract",
  AccessRights = "dc:accessRights",
  AccrualMethod = "dc:accrualMethod",
  AccrualPeriodicity = "dc:accrualPeriodicity",
  AccrualPolicy = "dc:accrualPolicy",
  Alternative = "dc:alternative",
  Audience = "dc:audience",
  Available = "dc:available",
  BibliographicCitation = "dc:bibliographicCitation",
  ConformsTo = "dc:conformsTo",
  Created = "dc:created",
  CreatedRaw = "dc:createdRaw",
  DateAccepted = "dc:dateAccepted",
  DateAcceptedRaw = "dc:dateAcceptedRaw",
  Copyrighted = "dc:copyrighted",
  CopyrightedRaw = "dc:CopyrightedRaw",
  DateSubmitted = "dc:dateSubmitted",
  DateSubmittedRaw = "dc:dateSubmittedRaw",
  EducationLevel = "dc:educationLevel",
  Extent = "dc:extent",
  HasFormat = "dc:hasFormat",
  HasPart = "dc:hasPart",
  HasVersion = "dc:hasVersion",
  InstructionalMethod = "dc:instructionalMethod",
  IsFormatOf = "dc:isFormatOf",
  IsPartOf = "dc:isPartOf",
  IsReferencedBy = "dc:isReferencedBy",
  IsReplacedBy = "dc:isReplacedBy",
  IsRequiredBy = "dc:isRequiredBy",
  Issued = "dc:issued",
  IsVersionOf = "dc:isVersionOf",
  License = "dc:license",
  Mediator = "dc:mediator",
  Medium = "dc:medium",
  Modified = "dc:modified",
  ModifiedRaw = "dc:modifiedRaw",
  Provenance = "dc:provenance",
  References = "dc:references",
  Replaces = "dc:replaces",
  Requires = "dc:requires",
  RightsHolder = "dc:rightsHolder",
  Spatial = "dc:spatial",
  TableOfContents = "dc:tableOfContents",
  Tempora = "dc:tempora",
  Valid = "dc:valid",
  Box = "dc:Box",
  DCMIType = "dc:DCMIType",
  DDC = "dc:DDC",
  IMT = "dc:IMT",
  ISO3166 = "dc:ISO3166",
  ISO6392 = "dc:ISO639-2",
  LLC = "dc:LLC",
  LCSH = "dc:LCSH",
  MESH = "dc:MESH",
  NLM = "dc:NLM",
  Period = "dc:Period",
  Point = "dc:Point",
  RFC1766 = "dc:RFC1766",
  RFC3066 = "dc:RFC3066",
  TGN = "dc:TGN",
  UDC = "dc:UDC",
  URI = "dc:URI",
  W3CDTF = "dc:W3CDTF",
}

export const DublinCoreFieldArray = [
  DublinCoreFields.Contributor,
  DublinCoreFields.Coverage,
  DublinCoreFields.Creator,
  DublinCoreFields.Date,
  DublinCoreFields.DateRaw,
  DublinCoreFields.Description,
  DublinCoreFields.Format,
  DublinCoreFields.Language,
  DublinCoreFields.Identifier,
  DublinCoreFields.Publisher,
  DublinCoreFields.Relation,
  DublinCoreFields.Rights,
  DublinCoreFields.Source,
  DublinCoreFields.Subject,
  DublinCoreFields.Title,
  DublinCoreFields.Type,
  DublinCoreFields.Abstract,
  DublinCoreFields.AccessRights,
  DublinCoreFields.AccrualMethod,
  DublinCoreFields.AccrualPeriodicity,
  DublinCoreFields.AccrualPolicy,
  DublinCoreFields.Alternative,
  DublinCoreFields.Audience,
  DublinCoreFields.Available,
  DublinCoreFields.BibliographicCitation,
  DublinCoreFields.ConformsTo,
  DublinCoreFields.Created,
  DublinCoreFields.CreatedRaw,
  DublinCoreFields.DateAccepted,
  DublinCoreFields.DateAcceptedRaw,
  DublinCoreFields.Copyrighted,
  DublinCoreFields.CopyrightedRaw,
  DublinCoreFields.DateSubmitted,
  DublinCoreFields.DateSubmittedRaw,
  DublinCoreFields.EducationLevel,
  DublinCoreFields.Extent,
  DublinCoreFields.HasFormat,
  DublinCoreFields.HasPart,
  DublinCoreFields.HasVersion,
  DublinCoreFields.InstructionalMethod,
  DublinCoreFields.IsFormatOf,
  DublinCoreFields.IsPartOf,
  DublinCoreFields.IsReferencedBy,
  DublinCoreFields.IsReplacedBy,
  DublinCoreFields.IsRequiredBy,
  DublinCoreFields.Issued,
  DublinCoreFields.IsVersionOf,
  DublinCoreFields.License,
  DublinCoreFields.Mediator,
  DublinCoreFields.Medium,
  DublinCoreFields.Modified,
  DublinCoreFields.ModifiedRaw,
  DublinCoreFields.Provenance,
  DublinCoreFields.References,
  DublinCoreFields.Replaces,
  DublinCoreFields.Requires,
  DublinCoreFields.RightsHolder,
  DublinCoreFields.Spatial,
  DublinCoreFields.TableOfContents,
  DublinCoreFields.Tempora,
  DublinCoreFields.Valid,
  DublinCoreFields.Box,
  DublinCoreFields.DCMIType,
  DublinCoreFields.DDC,
  DublinCoreFields.IMT,
  DublinCoreFields.ISO3166,
  DublinCoreFields.ISO6392,
  DublinCoreFields.LLC,
  DublinCoreFields.LCSH,
  DublinCoreFields.MESH,
  DublinCoreFields.NLM,
  DublinCoreFields.Period,
  DublinCoreFields.Point,
  DublinCoreFields.RFC1766,
  DublinCoreFields.RFC3066,
  DublinCoreFields.TGN,
  DublinCoreFields.UDC,
  DublinCoreFields.URI,
  DublinCoreFields.W3CDTF,
];
