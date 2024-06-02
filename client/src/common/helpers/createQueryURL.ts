import { SERVER_URL } from 'constants'

export function createQueryURL<T>(
  path: string,
  query: { [key in keyof T]: string },
  domain: string = SERVER_URL
) {
  const url = new URL(path, domain)
  const params = new URLSearchParams(query)
  url.search = params.toString()
  return url.toString()
}
