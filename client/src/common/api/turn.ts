import { SERVER_URL } from 'constants'
import { PostModel } from './posts'

export type TurnModel = {
  id: number
  post_maker: PostModel
  post_receive: PostModel
  day_of_turn: string
}

//
// getMyTurns

export async function getUserTurns(userId: number): Promise<TurnModel[]> {
  const resp = await fetch(`${SERVER_URL}/turns/my_turns/${userId}`)
  return await resp.json()
}
