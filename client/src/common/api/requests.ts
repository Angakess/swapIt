import { fetchPost } from '@Common/helpers'
import { PostModel } from './posts'
import { GenericApiResponse } from './types'
import { SERVER_URL } from 'constants'

//
// Requests types

export type RequestStateModel = {
  id: number
  name: 'aceptado' | 'pendiente' | 'rechazado' | 'semi-aceptado'
}

export type RequestModel = {
  id: number
  post_maker: PostModel
  post_receive: PostModel
  state: RequestStateModel['name']
  rejected: number
  day_of_request: string
  user_maker: number
  user_receive: number
}

//
// createRequest

type CreateRequestOptions = {
  user_maker: number
  post_maker: number
  user_receive: number
  post_receive: number
}

export async function createRequest(
  request: CreateRequestOptions
): Promise<GenericApiResponse<{ request: RequestModel }>> {
  const resp = await fetchPost(`${SERVER_URL}/requests/create/`, request)
  return await resp.json()
}
