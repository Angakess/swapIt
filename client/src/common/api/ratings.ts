//
// Rating types

import { SERVER_URL } from 'constants'
import { GenericApiResponse } from './types'
import { UserDetailsModel } from './users'

export type UserRatingModel = {
  score: number
  comment: string
  user_maker: {
    first_name: string
    last_name: string
  }
}

export type RatingModel = {
  id: number
  user_maker: UserDetailsModel
  user_received: UserDetailsModel
  score: number
  comment: string
  checked: boolean
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

//
// getUncheckedRatings()

export async function getUncheckedRatings(): Promise<RatingModel[]> {
  const resp = await fetch(`${SERVER_URL}/ratings/list/unchecked/`)
  const data: GenericApiResponse<{ ratings: RatingModel[] }> = await resp.json()
  return data.data.ratings
}

//
// moderateRating()

export async function moderateRating(
  id: number,
  comment: string
): Promise<boolean> {
  const resp = await fetch(`${SERVER_URL}/ratings/moderate/${id}/`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
    body: JSON.stringify({ comment }),
  })
  return resp.status === 200
}
