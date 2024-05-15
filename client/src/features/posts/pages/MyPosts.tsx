import { PlusOutlined } from '@ant-design/icons'
import { PageTitle } from '@Common/components'
import { useAuth } from '@Common/hooks'
import { PostsList, SearchAndFilter } from '@Posts/components'
import {
  getCategoryList,
  getPostList,
  PostModel,
} from '@Posts/helpers/getPostsListsExchanger'
import { Button, Divider } from 'antd'
import { useEffect, useState } from 'react'

type SelectOption = {
  label: string
  value: string
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name }) => ({ label: name, value: name }))
}

export function MyPosts() {
  const { user } = useAuth()

  const [categoriesOptions, setCategoriesFilter] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filterCategory, setFilterCategory] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchValue, setSearchValue] = useState('')

  async function handleSearch() {
    const p = await getPostList({
      userId: user!.id,
      search: searchValue,
      category: filterCategory,
      state: filterState,
      status: filterStatus,
    })
    setPosts(p)
  }

  useEffect(() => {
    ;(async () => {
      const categories = await mapCategoiresToSelectOptions()
      setCategoriesFilter([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostList({
        userId: user!.id,
      })
      setPosts(p)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle
        title="Mis publicaciones"
        right={
          <Button type="primary" icon={<PlusOutlined />}>
            Agregar
          </Button>
        }
      />

      <SearchAndFilter
        searchBar={{
          placeholder: 'Busca una publicación',
          value: searchValue,
          handleChange: (e) => setSearchValue(e.target.value),
        }}
        filters={[
          {
            placeholder: 'Categoría',
            options: categoriesOptions,
            defaultValue: '',
            value: filterCategory,
            handleChange: setFilterCategory,
          },
          {
            placeholder: 'Estado del producto',
            options: [
              { label: 'Todos los estados del producto', value: '' },
              { label: 'Nuevo', value: 'NUEVO' },
              { label: 'Usado', value: 'USADO' },
              { label: 'Defectuoso', value: 'DEFECTUOSO' },
            ],
            defaultValue: '',
            value: filterState,
            handleChange: setFilterState,
          },
          {
            placeholder: 'Estado de la publicación',
            options: [
              { label: 'Todos los estados de la publicación', value: '' },
              { label: 'Activo', value: 'activo' },
              { label: 'Pendiente', value: 'pendiente' },
              { label: 'Suspendido', value: 'suspendido' },
              { label: 'Rechazado', value: 'rechazado' },
              { label: 'Bloqueado', value: 'bloqueado' },
            ],
            defaultValue: '',
            value: filterStatus,
            handleChange: setFilterStatus,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Divider />

      <PostsList posts={posts} isLoading={isLoading} showStatus />
    </>
  )
}
