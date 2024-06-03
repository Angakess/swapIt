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

//
// putUserInReview

export async function putUserInReview(
  userId: number
): Promise<GenericApiResponse<never>> {
  const resp = await fetch(`${SERVER_URL}/users/put-in-review/${userId}`)
  return await resp.json()
}
