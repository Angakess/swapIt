import { useEffect, useState } from 'react'
import { Divider } from 'antd'

import { useAuth } from '@Common/hooks'
import { PostsList, SearchAndFilter } from '@Posts/components'
import {
  PostModel,
  getCategoryList,
  getPostsListsExchanger,
} from '@Posts/helpers/getPostsListsExchanger'
import { PageTitle } from '@Common/components'

type SelectOption = {
  label: string
  value: string
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name }) => ({ label: name, value: name }))
}

export function Posts() {
  const { user } = useAuth()

  const [categoriesOptions, setCategoriesFilter] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])

  const [filterCategory, setFilterCategory] = useState('')
  const [filterState, setFilterState] = useState('')
  const [searchValue, setSearchValue] = useState('')

  async function handleSearch() {
    const p = await getPostsListsExchanger({
      excludeUserId: user!.id,
      search: searchValue,
      category: filterCategory,
      state: filterState,
      status: 'activo',
    })
    setPosts(p)
  }

  useEffect(() => {
    ;(async () => {
      const categories = await mapCategoiresToSelectOptions()
      setCategoriesFilter([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostsListsExchanger({
        excludeUserId: user!.id,
        status: 'activo',
      })
      setPosts(p)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Publicaciones" />
      <SearchAndFilter
        searchBar={{
          placeholder: 'Busca un producto',
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
      <PostsList posts={posts} />
    </>
  )
}
