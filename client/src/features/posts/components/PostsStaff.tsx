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
  const [searchValue, setSearchValue] = useState('')

  async function handleSearch() {
    const p = await getPostList({
      search: searchValue,
      category: filterCategory,
      state: filterState,
      status: 'pendiente',
    })
    setPosts(p)
  }

  useEffect(() => {
    ;(async () => {
      const categories = await mapCategoiresToSelectOptions()
      setCategoriesOptions([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostList({ status: 'pendiente' })
      setPosts(p)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Publicaciones pendientes de revisión" />
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
            placeholder: 'Estado',
            options: [
              { label: 'Todos los estados', value: '' },
              { label: 'Nuevo', value: 'NUEVO' },
              { label: 'Usado', value: 'USADO' },
              { label: 'Defectuoso', value: 'DEFECTUOSO' },
            ],
            defaultValue: '',
            value: filterState,
            handleChange: setFilterState,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Divider />
      <PostsList posts={posts} isLoading={isLoading} />
    </>
  )
}
