export const VALUE_TYPES = {
  Object: "object",
  String: "string",
  Number: "number",
} as const;

export type ValueType =
  (typeof VALUE_TYPES)[keyof typeof VALUE_TYPES];
