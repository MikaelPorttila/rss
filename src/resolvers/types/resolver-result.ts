export interface ResolverResult {
  handled: boolean;
  isDate?: boolean;
  isNumber?: boolean;
  isArray?: boolean;
  newName?: string;
}
