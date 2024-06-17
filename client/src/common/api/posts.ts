import { SERVER_URL } from 'constants'
import { GenericApiResponse } from './types'
import { fetchPost } from '@Common/helpers'
import { CategoryModel } from './categories'
import { SubsidiaryModel } from './subsidiaries'
import { UserModel } from './users'

//
// Post types

export enum PostStateNameEnum {
  activo = 'activo',
  pendiente = 'pendiente',
  suspendido = 'suspendido',
  bloqueado = 'bloqueado',
  eliminado = 'eliminado',
  rechazado = 'rechazado',
  sinStock = 'sin-stock',
}

export type PostStateNames = `${PostStateNameEnum}`

export type PostStateModel = {
  id: number
  name: PostStateNames
}

export type ProductStateModel = 'NUEVO' | 'USADO' | 'DEFECTUOSO'

export type PostModel = {
  id: number
  name: string
  description: string
  value: number
  user: UserModel
  subsidiary: SubsidiaryModel
  state: PostStateModel
  category: CategoryModel
  state_product: ProductStateModel
  stock_product: number
  image_1: string
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
}

export type PostBasicModel = {
  id: number
  name: string
  description: string
  value: number
  user: number
  subsidiary: number
  state: number
  category: number
  state_product: ProductStateModel
  stock_product: number
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
  state?: ProductStateModel | ''
  status?: PostStateModel['name'] | ''
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
  state?: ProductStateModel | ''
  status?: PostStateModel['name'] | ''
  category?: string
}

export async function getPostList({
  userId = '',
  search = '',
  state = '',
  status = '',
  category = '',
}: GetPostListOptions = {}): Promise<PostModel[]> {
  const URL = `${SERVER_URL}/post/list/?search=${search}&state_product=${state}&state__name=${status}&category__name=${category}&user__id=${userId}`

  const resp = await fetch(URL)
  const data = await resp.json()

  return data
}

//
// getPostById

export async function getPostById(
  id: number
): Promise<{ editable: boolean; post: PostModel } | null> {
  const resp = await fetch(`${SERVER_URL}/post/${id}`)
  const data = await resp.json()

  return data.ok ? data.data : null
}

//
// moderatePost

type ModeratePostOptions = {
  postId: number
  moderation: 'approve' | 'reject'
  newValue?: number
}

export async function moderatePost({
  postId,
  moderation,
  newValue,
}: ModeratePostOptions): Promise<GenericApiResponse<{ post: PostBasicModel }>> {
  // Si se aprueba pone el estado en 1 (activo), sino en 6 (rechazado)
  const stateId = moderation === 'approve' ? 1 : 6

  const resp = await fetchPost(`${SERVER_URL}/post/moderate/`, {
    post_id: postId,
    state_id: stateId,
    value: newValue,
  })

  const data: GenericApiResponse<{ post: PostBasicModel }> = await resp.json()
  return data
}
