import { ValueField } from "./value-field.ts";

// Based on https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
export interface DublinCoreValueFields {
  "dc:contributor"?: ValueField<string>[];
  "dc:coverage"?: ValueField<string>;
  "dc:creator"?: ValueField<string>[];
  "dc:date"?: ValueField<Date>;
  "dc:dateRaw"?: ValueField<string>;
  "dc:description"?: ValueField<string>;
  "dc:format"?: ValueField<string>;
  "dc:language"?: ValueField<string>;
  "dc:identifier"?: ValueField<string>;
  "dc:publisher"?: ValueField<string>;
  "dc:relation"?: ValueField<string>;
  "dc:rights"?: ValueField<string>;
  "dc:source"?: ValueField<string>;
  "dc:subject"?: ValueField<string>;
  "dc:title"?: ValueField<string>;
  "dc:type"?: ValueField<string>;
  "dc:abstract"?: ValueField<string>;
  "dc:accessRights"?: ValueField<string>;
  "dc:accrualMethod"?: ValueField<string>;
  "dc:accrualPeriodicity"?: ValueField<string>;
  "dc:accrualPolicy"?: ValueField<string>;
  "dc:alternative"?: ValueField<string>;
  "dc:audience"?: ValueField<string>;
  "dc:available"?: ValueField<string>;
  "dc:bibliographicCitation"?: ValueField<string>;
  "dc:conformsTo"?: ValueField<string>;
  "dc:created"?: ValueField<Date>;
  "dc:createdRaw"?: ValueField<string>;
  "dc:dateAccepted"?: ValueField<Date>;
  "dc:dateAcceptedRaw"?: ValueField<string>;
  "dc:Copyrighted"?: ValueField<Date>;
  "dc:CopyrightedRaw"?: ValueField<string>;
  "dc:dateSubmitted"?: ValueField<Date>;
  "dc:dateSubmittedRaw"?: ValueField<string>;
  "dc:educationLevel"?: ValueField<string>;
  "dc:extent"?: ValueField<string>;
  "dc:hasFormat"?: ValueField<string>;
  "dc:hasPart"?: ValueField<string>;
  "dc:hasVersion"?: ValueField<string>;
  "dc:instructionalMethod"?: ValueField<string>;
  "dc:isFormatOf"?: ValueField<string>;
  "dc:isPartOf"?: ValueField<string>;
  "dc:isReferencedBy"?: ValueField<string>;
  "dc:isReplacedBy"?: ValueField<string>;
  "dc:isRequiredBy"?: ValueField<string>;
  "dc:issued"?: ValueField<string>;
  "dc:isVersionOf"?: ValueField<string>;
  "dc:license"?: ValueField<string>;
  "dc:mediator"?: ValueField<string>;
  "dc:medium"?: ValueField<string>;
  "dc:modified"?: ValueField<Date>;
  "dc:modifiedRaw"?: ValueField<string>;
  "dc:provenance"?: ValueField<string>;
  "dc:references"?: ValueField<string>;
  "dc:replaces"?: ValueField<string>;
  "dc:requires"?: ValueField<string>;
  "dc:rightsHolder"?: ValueField<string>;
  "dc:spatial"?: ValueField<string>;
  "dc:tableOfContents"?: ValueField<string>;
  "dc:tempora"?: ValueField<string>;
  "dc:valid"?: ValueField<Date>[];
  "dc:Box"?: ValueField<string>;
  "dc:DCMIType"?: ValueField<string>[];
  "dc:DDC"?: ValueField<string>;
  "dc:IMT"?: ValueField<string>;
  "dc:ISO3166"?: ValueField<string>;
  "dc:ISO639-2"?: ValueField<string>;
  "dc:LLC"?: ValueField<string>;
  "dc:LCSH"?: ValueField<string>;
  "dc:MESH"?: ValueField<string>;
  "dc:NLM"?: ValueField<string>;
  "dc:Period"?: ValueField<string>;
  "dc:Point"?: ValueField<string>;
  "dc:RFC1766"?: ValueField<string>;
  "dc:RFC3066"?: ValueField<string>;
  "dc:TGN"?: ValueField<string>[];
  "dc:UDC"?: ValueField<string>;
  "dc:URI"?: ValueField<string>;
  "dc:W3CDTF"?: ValueField<string>;
}

export interface DublinCore {
  "dc:contributor"?: string[];
  "dc:coverage"?: string;
  "dc:creator"?: string[];
  "dc:date"?: Date;
  "dc:dateRaw"?: string;
  "dc:description"?: string;
  "dc:format"?: string;
  "dc:language"?: string;
  "dc:identifier"?: string;
  "dc:publisher"?: string;
  "dc:relation"?: string;
  "dc:rights"?: string;
  "dc:source"?: string;
  "dc:subject"?: string;
  "dc:title"?: string;
  "dc:type"?: string;
  "dc:abstract"?: string;
  "dc:accessRights"?: string;
  "dc:accrualMethod"?: string;
  "dc:accrualPeriodicity"?: string;
  "dc:accrualPolicy"?: string;
  "dc:alternative"?: string;
  "dc:audience"?: string;
  "dc:available"?: string;
  "dc:bibliographicCitation"?: string;
  "dc:conformsTo"?: string;
  "dc:created"?: Date;
  "dc:createdRaw"?: string;
  "dc:dateAccepted"?: Date;
  "dc:dateAcceptedRaw"?: string;
  "dc:Copyrighted"?: Date;
  "dc:CopyrightedRaw"?: string;
  "dc:dateSubmitted"?: Date;
  "dc:dateSubmittedRaw"?: string;
  "dc:educationLevel"?: string;
  "dc:extent"?: string;
  "dc:hasFormat"?: string;
  "dc:hasPart"?: string;
  "dc:hasVersion"?: string;
  "dc:instructionalMethod"?: string;
  "dc:isFormatOf"?: string;
  "dc:isPartOf"?: string;
  "dc:isReferencedBy"?: string;
  "dc:isReplacedBy"?: string;
  "dc:isRequiredBy"?: string;
  "dc:issued"?: string;
  "dc:isVersionOf"?: string;
  "dc:license"?: string;
  "dc:mediator"?: string;
  "dc:medium"?: string;
  "dc:modified"?: Date;
  "dc:modifiedRaw"?: string;
  "dc:provenance"?: string;
  "dc:references"?: string;
  "dc:replaces"?: string;
  "dc:requires"?: string;
  "dc:rightsHolder"?: string;
  "dc:spatial"?: string;
  "dc:tableOfContents"?: string;
  "dc:tempora"?: string;
  "dc:valid"?: Date[];
  "dc:Box"?: string;
  "dc:DCMIType"?: string[];
  "dc:DDC"?: string;
  "dc:IMT"?: string;
  "dc:ISO3166"?: string;
  "dc:ISO639-2"?: string;
  "dc:LLC"?: string;
  "dc:LCSH"?: string;
  "dc:MESH"?: string;
  "dc:NLM"?: string;
  "dc:Period"?: string;
  "dc:Point"?: string;
  "dc:RFC1766"?: string;
  "dc:RFC3066"?: string;
  "dc:TGN"?: string[];
  "dc:UDC"?: string;
  "dc:URI"?: string;
  "dc:W3CDTF"?: string;
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
