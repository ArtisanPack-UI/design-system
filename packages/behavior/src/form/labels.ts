/**
 * The labels a caller set: drops `undefined`, `null` and empty strings, so a
 * component can pass every `*Label` prop through and keep the English
 * defaults for the ones left unset.
 */
export function definedLabels<T extends object>(labels: Partial<T> | null | undefined): Partial<T> {
  return Object.fromEntries(
    Object.entries(labels ?? {}).filter(
      ([, text]) => text !== undefined && text !== null && text !== '',
    ),
  ) as Partial<T>;
}
