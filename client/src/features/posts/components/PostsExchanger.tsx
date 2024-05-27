import { useEffect, useState } from 'react'
import { Divider } from 'antd'

import { useAuth } from '@Common/hooks'
import { getCategoryList, getPostsListsExchanger, PostModel } from '@Common/api'
import { PostsList, SearchAndFilter } from '@Posts/components'
import { PageTitle } from '@Common/components'

type SelectOption = {
  label: string
  value: string
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name }) => ({ label: name, value: name }))
}

export function PostsExchanger() {
  const { user } = useAuth()

  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      setCategoriesOptions([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostsListsExchanger({
        excludeUserId: user!.id,
        status: 'activo',
      })
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
