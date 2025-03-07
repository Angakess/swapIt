import { fetchPost } from '@Common/helpers'
import { PostModel } from './posts'
import { GenericApiResponse } from './types'
import { SERVER_URL } from 'constants'
import { createQueryURL } from '@Common/helpers/createQueryURL'
import { Dayjs } from 'dayjs'

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

//
// getRequestList

type GetRequestListOptions = {
  search?: string
  stateName?: string
  postMakerId?: string | number
  postReceiverId?: string | number
  userMakerDni?: string
  userReceiverDni?: string
  userMakerId?: string | number
  userReceiverId?: string | number
}

export async function getRequestList({
  search = '',
  stateName = '',
  postMakerId = '',
  postReceiverId = '',
  userMakerDni = '',
  userReceiverDni = '',
  userMakerId = '',
  userReceiverId = '',
}: GetRequestListOptions = {}) {
  const url = createQueryURL('/requests/list/', {
    search: search,
    state__name: stateName,
    post_maker: postMakerId.toString(),
    post_receive: postReceiverId.toString(),
    user_maker__dni: userMakerDni,
    user_receive__dni: userReceiverDni,
    user_maker__id: userMakerId.toString(),
    user_receive__id: userReceiverId.toString(),
  })

  const resp = await fetch(url)
  const data = await resp.json()
  return data
}

//
// getRequestById

export async function getRequestById(id: number): Promise<RequestModel | null> {
  const resp = await fetch(`${SERVER_URL}/requests/list/${id}/`)
  const data: GenericApiResponse<RequestModel> = await resp.json()
  return data.ok ? data.data : null
}

//
// acceptRequest

export async function acceptRequest(
  id: number,
  date: Dayjs
): Promise<GenericApiResponse<{ request: RequestModel }>> {
  const resp = await fetchPost(`${SERVER_URL}/requests/accept/`, {
    request_id: id,
    date_of_request: date.format('YYYY-MM-DD'),
  })
  return await resp.json()
}

//
// rejectRequest

export async function rejectRequest(
  id: number
): Promise<GenericApiResponse<Record<string, never>>> {
  const resp = await fetchPost(`${SERVER_URL}/requests/reject/`, {
    request_id: id,
  })
  return await resp.json()
}

//
// cancelRequest

export async function cancelRequest(
  id: number
): Promise<GenericApiResponse<Record<string, never>>> {
  const resp = await fetchPost(`${SERVER_URL}/requests/cancel_request/`, {
    request_id: id,
  })
  return await resp.json()
}

//
// confirmRequest

export async function confirmRequest(
  decision: 'accept' | 'reject',
  requestId: number,
  userMakerId: number
): Promise<GenericApiResponse<{ turn_id: number }>> {
  const resp = await fetchPost(`${SERVER_URL}/requests/confirm/`, {
    request_id: requestId,
    user_maker: userMakerId,
    decision: decision,
  })
  return await resp.json()
}
