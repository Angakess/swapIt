import { SERVER_URL } from 'constants'
import { CategoryModel } from './types'

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
