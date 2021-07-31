export interface ResolverResult {
  handled: boolean;
  isDate?: boolean;
  isInt?: boolean;
	isFloat?: boolean;
  isArray?: boolean;
  propertyName: string;
}
