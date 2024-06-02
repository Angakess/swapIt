//
// Generic API types

export type GenericApiResponse<T> =
  | { ok: true; data: T; messages: string[] }
  | { ok: false; data: never; messages: string[] }
