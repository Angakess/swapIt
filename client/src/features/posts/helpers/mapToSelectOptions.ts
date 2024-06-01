import { getCategoryList, getSubsidiaries } from '@Common/api'

export type SelectOption = {
  label: string
  value: string
}

export async function mapCategoriesToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }))
}

export async function mapSubsidiariesToSelectOption(): Promise<SelectOption[]> {
  const subsidiaries = await getSubsidiaries()
  return subsidiaries
    .filter(({ active }) => active)
    .map(({ name, id }) => ({ label: name, value: id.toString() }))
}
