//
// User types

import { SERVER_URL } from 'constants'
import { GenericApiResponse } from './types'
import { fetchPost } from '@Common/helpers'

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

export type UserDetailsModel = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  date_of_birth: string
  phone_number: string
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

//
// getUserDetails

export async function getUserDetails(
  id: number
): Promise<UserDetailsModel | null> {
  const resp = await fetch(`${SERVER_URL}/users/get/${id}`)

  if (resp.status === 404) return null

  const data: UserDetailsModel = await resp.json()
  return data
}

//
// editUserProfile

export type EditUserProfileOptions = {
  id: UserDetailsModel['id']
  current_password: string
  email?: UserDetailsModel['email']
  phone_number?: UserDetailsModel['phone_number']
  date_of_birth?: UserDetailsModel['date_of_birth']
  gender?: UserDetailsModel['gender']
  new_password?: string
}

export async function editUserProfile(
  user: EditUserProfileOptions
): Promise<GenericApiResponse<{ user: UserDetailsModel }>> {
  const resp = await fetch(`${SERVER_URL}/users/update-profile/${user.id}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
    body: JSON.stringify({ ...user }),
  })
  return resp.json()
}

//
// removeExchanger

export async function removeExchanger(
  exchangerId: number,
  password: string
): Promise<GenericApiResponse<never>> {
  const resp = await fetch(
    `${SERVER_URL}/users/remove-exchanger/${exchangerId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: password }),
    }
  )
  return resp.json()
}
