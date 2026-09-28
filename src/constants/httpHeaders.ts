export const HTTP_HEADERS = {
  ContentType: "Content-Type",
} as const;
export type HttpHeader =
  (typeof HTTP_HEADERS)[keyof typeof HTTP_HEADERS];

export const HTTP_MEDIA_TYPES = {
  Json: "application/json",
} as const;
export type HttpMediaType =
  (typeof HTTP_MEDIA_TYPES)[keyof typeof HTTP_MEDIA_TYPES];
