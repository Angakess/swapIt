import { SERVER_URL } from 'constants'

//
// Subsidiaries types

export type SubsidiaryModel = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  cant_current_helpers: number
  active: boolean
}

//
// getSubsidiaries

export async function getSubsidiaries({
  search = '',
}: { search?: string } = {}): Promise<SubsidiaryModel[]> {
  const URL = `${SERVER_URL}/subsidiary/subsidiaries/?search=${search}`

  const resp = await fetch(URL)
  const data = await resp.json()

  return data
}
