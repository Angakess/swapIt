import { getCategoryList, getSubsidiaries } from '@Common/api'

export type SelectOption = {
  label: string
  value: string
}

export async function mapCategoriesToSelectOptions(
  value: 'id' | 'name'
): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map((category) => ({
    label: category.name,
    value: category[value].toString(),
  }))
}

export async function mapSubsidiariesToSelectOption(
  value: 'id' | 'name'
): Promise<SelectOption[]> {
  const subsidiaries = await getSubsidiaries()
  return subsidiaries
    .filter(({ active }) => active)
    .map((subsidiary) => ({
      label: subsidiary.name,
      value: subsidiary[value].toString(),
    }))
}
