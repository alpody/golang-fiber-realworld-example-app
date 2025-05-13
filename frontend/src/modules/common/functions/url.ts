export const decodePathParams = <TObj extends Record<string, string>, TKey extends keyof TObj>(
  pathParams: TObj,
): Record<TKey, string> => {
  const decodedKeyValues = Object.entries(pathParams).map(([key, value]) => [key, decodeURIComponent(value)]);
  return Object.fromEntries(decodedKeyValues);
};
