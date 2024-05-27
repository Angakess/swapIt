import { SERVER_URL } from 'constants'
import { SubsidiaryModel } from './types'

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
