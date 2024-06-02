//
// Generic API types

export type GenericApiResponse<T> = {
  ok: boolean
  data: T
  messages: string[]
}
