import { PostsList, SearchAndFilter } from '@Posts/components'
import { Divider, Flex, Pagination, SelectProps } from 'antd'
import MOCK_POSTS from '@Posts/MOCK_POSTS.json'

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
            placeholder: 'Categoría',
            options: categoryOptions,
            defaultValue: 'all',
          },
          {
            placeholder: 'Estado',
            options: stateOptions,
            defaultValue: 'all',
          },
        ]}
      />
      <Divider />
      <PostsList posts={MOCK_POSTS.posts} />
      <Flex
        justify="center"
        style={{ margin: '2rem 0', paddingBottom: '1rem' }}
      >
        <Pagination defaultCurrent={1} total={12} />
      </Flex>
    </>
  )
}
