//
// User types

import { SERVER_URL } from 'constants'
import { GenericApiResponse } from './types'

export enum UserStateNameEnum {
  bloqueado = 'bloqueado',
  suspendido = 'suspendido',
  activo = 'activo',
  inactivo = 'inactivo',
  eliminado = 'eliminado',
}

export type UserStateName = `${UserStateNameEnum}`

export enum UserGenderEnum {
  male = 'MALE',
  female = 'FEMALE',
  other = 'OTHER',
}

export type UserGender = `${UserGenderEnum}`

export type UserModel = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  role: string
  state: {
    name: UserStateName
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

export type ExchangerModel = {
  id: number
  full_name: string
  dni: string
  email: string
  user_state: UserStateName
  rating: number
  gender: UserGender
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

//
// getExchangersList

export async function getExchangersList(): Promise<ExchangerModel[]> {
  const resp = await fetch(`${SERVER_URL}/users/list-exchangers/`)
  const data: ExchangerModel[] = await resp.json()
  return data
}
