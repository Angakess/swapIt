import { Divider } from 'antd'
import { PostsList } from './PostsList'
import { PageTitle } from '@Common/components'
import { SearchAndFilter } from './SearchAndFilter'
import { useEffect, useState } from 'react'
import {
  PostModel,
  getCategoryList,
  getPostList,
} from '@Posts/helpers/getPostsListsExchanger'

type SelectOption = {
  label: string
  value: string
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name }) => ({ label: name, value: name }))
}

export function PostsStaff() {
  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filterCategory, setFilterCategory] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterStatus, setFilterStatus] = useState('pendiente')
  const [searchValue, setSearchValue] = useState('')

  async function handleSearch() {
    const searchedPosts = await getPostList({
      search: searchValue,
      category: filterCategory,
      state: filterState,
      status: filterStatus,
    })

    const p = searchedPosts.filter(
      (po) => po.state.name === 'activo' || po.state.name === 'pendiente'
    )
    setPosts(p)
  }

  useEffect(() => {
    ;(async () => {
      const categories = await mapCategoiresToSelectOptions()
      setCategoriesOptions([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostList({ status: filterStatus })
      setPosts(p)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Publicaciones" />
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
            placeholder: 'Estado producto',
            options: [
              { label: 'Todos los estados de producto', value: '' },
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
            ],
            defaultValue: 'pendiente',
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
