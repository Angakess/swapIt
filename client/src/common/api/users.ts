//
// User types

import { SERVER_URL } from 'constants'
import { GenericApiResponse } from './types'

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

export type HelperModel = {
  id: number
  full_name: string
  dni: string
  subsidiary: {
    name: string
    cant_current_helpers: number
  }
}

//
// putUserInReview

export async function putUserInReview(
  userId: number
): Promise<GenericApiResponse<never>> {
  const resp = await fetch(`${SERVER_URL}/users/put-in-review/${userId}`)
  return await resp.json()
}

//
// getUserScore

export async function getUserScore(
  userId: number
): Promise<number | undefined> {
  const resp = await fetch(`${SERVER_URL}/users/score/${userId}`)
  const data: GenericApiResponse<{ score: number }> = await resp.json()
  return data?.ok ? data.data.score : undefined
}

//
// getHelpersList

export async function getHelpersList(): Promise<HelperModel[]> {
  const resp = await fetch(`${SERVER_URL}/users/list-helpers/`)
  const data: HelperModel[] = await resp.json()
  return data
}
