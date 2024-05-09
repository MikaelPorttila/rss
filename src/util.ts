export function copyValueFields(fields: string[], source: any, target: any): void {
  for (const fieldName of fields) {
    const field = source[fieldName];
    if (field) {
      target[fieldName] = Array.isArray(field)
        ? field.map((x) => (x?.value || x))
        : (field?.value || field);
    }
  }
};
