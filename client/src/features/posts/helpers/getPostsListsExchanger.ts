import { SERVER_URL } from 'constants'

//
// Types definition

export type UserModel = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  role: string
  state: {
    name: string
  }
}

export type SubsidiaryModel = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  active: boolean
}

export type StateModel = {
  id: number
  name: string
}

export type CategoryModel = {
  id: number
  name: string
  active: boolean
}

export type ProductStateModel = 'NUEVO' | 'USADO' | 'DEFECTUOSO'

export type PostModel = {
  id: number
  name: string
  description: string
  value: number
  user: UserModel
  subsidiary: SubsidiaryModel
  state: StateModel
  category: CategoryModel
  state_product: ProductStateModel
  image_1: string
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
}

//
// getPostsListsExchanger

type GetPostsListsExchangerOptions = {
  excludeUserId: number
  search?: string
  state?: string
  status?: string
  category?: string
}

export async function getPostsListsExchanger({
  excludeUserId,
  search = '',
  state = '',
  status = '',
  category = '',
}: GetPostsListsExchangerOptions): Promise<PostModel[]> {
  let url = `${SERVER_URL}/post/list/${excludeUserId}/?`
  const extraParams = []

  if (search) extraParams.push(`search=${search}`)
  if (state) extraParams.push(`state_product=${state}`)
  if (status) extraParams.push(`state__name=${status}`)
  if (category) extraParams.push(`category__name=${category}`)

  url += extraParams.join('&')

  const resp = await fetch(url)
  const data = await resp.json()
  return data
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

export async function getPostById(id: number): Promise<PostModel | null> {
  const resp = await fetch(`${SERVER_URL}/post/${id}`)
  const data = await resp.json()

  return data?.data?.post ?? null
}
