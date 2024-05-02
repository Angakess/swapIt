import { PostsList } from '@Posts/components'
import { Button, Divider, Flex, SelectProps } from 'antd'
import { SearchBar, SelectFilter } from 'components'

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
      <SearchBar />
      <Flex gap={'1rem'} style={{ marginBottom: '1rem' }}>
        <SelectFilter
          options={categoryOptions}
          defaultValue="all"
          placeholder="Categoría"
        />
        <SelectFilter
          options={stateOptions}
          defaultValue="all"
          placeholder="Estado"
        />
      </Flex>
      <Flex justify="end">
        <Button type="primary">Buscar</Button>
      </Flex>
      <Divider />
      <PostsList />
    </>
  )
}
