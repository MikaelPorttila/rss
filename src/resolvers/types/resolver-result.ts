export interface ResolverResult {
  isHandled: boolean;
  isDate?: boolean;
  isInt?: boolean;
  isFloat?: boolean;
  isArray?: boolean;
  name: string;
}
