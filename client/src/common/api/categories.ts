import { SERVER_URL } from 'constants'

//
// Categories types

export type CategoryModel = {
  id: number
  name: string
  active: boolean
}

//
// getCategoryList

type GetCategoryListOptions = {
  search?: string
  active?: boolean
}

export async function getCategoryList({
  search = '',
  active = true,
}: GetCategoryListOptions = {}): Promise<CategoryModel[]> {
  const URL = `${SERVER_URL}/category/list/?search=${search}&active=${active}`

  const resp = await fetch(URL)
  const data = await resp.json()

  return data.data?.categories ?? []
}
