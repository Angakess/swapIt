import { SERVER_URL } from 'constants'
import { PostModel } from './types'

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
