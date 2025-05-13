/* eslint @typescript-eslint/no-empty-object-type: off */
export type FilterRequired<T extends Record<PropertyKey, unknown>> = {
  [P in keyof T as {} extends Pick<T, P> ? never : P]: T[P];
};

export type OptionalUndefined<T> = Omit<
  {
    [P in keyof T as undefined extends T[P] ? never : P]: T[P];
  } & {
    [P in keyof T]?: T[P];
  },
  never
>;

// export type OptionalEmptyObject<T extends Record<PropertyKey, U>, U> = Omit<
//   {
//     [P in keyof T as T[P] extends Record<PropertyKey, U> ? ({} extends T[P] ? never : P) : P]: T[P] extends Record<
//       PropertyKey,
//       U
//     >
//       ? OptionalEmptyObject<T[P], U>
//       : T[P];
//   } & {
//     [P in keyof T]?: T[P];
//   },
//   never
// >;

export type GetValueRecursive<T extends object, K extends PropertyKey[]> = K extends [
  infer First,
  ...infer Rest extends PropertyKey[],
]
  ? First extends keyof T
    ? T[First] extends object
      ? GetValueRecursive<T[First], Rest>
      : T[First]
    : never
  : T;
