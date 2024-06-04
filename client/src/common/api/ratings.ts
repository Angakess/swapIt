//
// Rating types

import { SERVER_URL } from 'constants'
import { GenericApiResponse } from './types'

export type UserRatingModel = {
  score: number
  comment: string
  user_maker: {
    first_name: string
    last_name: string
  }
}

//
// getUserScoresById

export async function getUserRatings(
  userId: number
): Promise<UserRatingModel[]> {
  const resp = await fetch(`${SERVER_URL}/ratings/user/${userId}`)
  const data: GenericApiResponse<{ ratings: UserRatingModel[] }> =
    await resp.json()
  return data?.ok ? data.data.ratings : []
}
