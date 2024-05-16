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
// getPostList

type GetPostListOptions = {
  userId?: string | number
  search?: string
  state?: string
  status?: string
  category?: string
}

export async function getPostList({
  userId = '',
  search = '',
  state = '',
  status = '',
  category = '',
}: GetPostListOptions): Promise<PostModel[]> {
  const URL = `${SERVER_URL}/post/list/?search=${search}&state_product=${state}&state__name=${status}&category__name=${category}&user__id=${userId}`

  const resp = await fetch(URL)
  const data = await resp.json()

  return data
}

//
// getPostById

export async function getPostById(id: number): Promise<PostModel | null> {
  const resp = await fetch(`${SERVER_URL}/post/${id}`)
  const data = await resp.json()

  return data?.data?.post ?? null
}

//
// getCategoryList

type GetCategoryListOptions = {
  search?: string
  active?: boolean
}

export async function getter(url: string, query: Record<string, string>) {
  const endpoint =
    SERVER_URL +
    url +
    '?' +
    Object.entries(query)
      .reduce((acc, [key, value]) => {
        return `${acc}${key}=${value}&`
      }, '')
      .slice(0, -1)

  console.log(endpoint)
  return fetch(endpoint)
    .then((response) => response.json())
    .then((response) => {
      console.log('[DATA]', response)
      return response
    })
    .catch((error) => {
      console.error('Error:', error)
      return []
    })
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

//
// getSubsidiaries

export async function getSubsidiaries({
  search = '',
}: { search?: string } = {}): Promise<SubsidiaryModel[]> {
  const URL = `${SERVER_URL}/subsidiary/subsidiaries/?search=${search}`

  const resp = await fetch(URL)
  const data = await resp.json()

  return data
}
