import { SERVER_URL } from 'constants'
import { PostModel } from './posts'
import { SubsidiaryModel } from './subsidiaries'
import { fetchPost } from '@Common/helpers'

export type TurnModel = {
  id: number
  post_maker: PostModel
  post_receive: PostModel
  day_of_turn: string
}

type UserTurnModel = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
}

export enum TurnStateNameEnum {
  'pendiente' = 'pendiente',
  'efectuado' = 'efectuado',
  'no efectuado' = 'no efectuado',
  'sin calificar' = 'sin calificar',
}

export type TurnStateNames = `${TurnStateNameEnum}`

export type TurnStateModel = {
  id: number
  name: TurnStateNames
}

export type TurnDataModel = {
  id: number
  subsidiary: SubsidiaryModel
  user_maker: UserTurnModel
  user_received: UserTurnModel
  post_maker: PostModel
  post_receive: PostModel
  state: TurnStateNames
  code_maker: string
  code_received: string
  day_of_turn: string
}

//
// getMyTurns

export async function getUserTurns(userId: number): Promise<TurnModel[]> {
  const resp = await fetch(`${SERVER_URL}/turns/my_turns/${userId}`)
  return await resp.json()
}

//
// getTurnData

export async function getTurnData(
  turnId: number
): Promise<TurnDataModel | null> {
  const resp = await fetch(`${SERVER_URL}/turns/rating/${turnId}/`)
  return resp.ok ? await resp.json() : null
}

//
// createRating

type CreateRatingOptions = {
  score: number
  comment: string
  userMakerId: number
  userReceivedId: number
}

export async function createRating(
  rating: CreateRatingOptions
): Promise<boolean> {
  const resp = await fetchPost(`${SERVER_URL}/ratings/create/`, {
    score: rating.score,
    comment: rating.comment,
    user_maker: rating.userMakerId,
    user_received: rating.userReceivedId,
  })
  return resp.ok
}
