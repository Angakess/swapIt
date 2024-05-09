import { PostsList, SearchAndFilter } from '@Posts/components'
import { Divider, SelectProps } from 'antd'

const categoryOptions: SelectProps['options'] = [
  { label: 'Todas las categorías', value: 'all' },
  { label: 'Útiles escolares', value: 'Útiles escolares' },
  { label: 'Ropa', value: 'Ropa' },
  { label: 'Alimentos', value: 'Alimentos' },
  { label: 'Herramientas', value: 'Herramientas' },
]

const stateOptions: SelectProps['options'] = [
  { label: 'Todos los estados', value: 'all' },
  { label: 'Nuevo', value: 'Nuevo' },
  { label: 'Excelente estado', value: 'Excelente estado' },
  { label: 'Buen estado', value: 'Buen estado' },
  { label: 'Usado', value: 'Usado' },
]

export function Posts() {
  return (
    <>
      <h2 style={{ marginBottom: '2rem' }}>Publicaciones</h2>
      <SearchAndFilter
        searchBar={{ placeholder: 'Busca un producto' }}
        filters={[
          {
            options: categoryOptions,
            defaultValue: 'all',
            placeholder: 'Categoría',
          },
          {
            options: stateOptions,
            defaultValue: 'all',
            placeholder: 'Estado',
          },
        ]}
      />
      <Divider />
      <PostsList />
    </>
  )
}
