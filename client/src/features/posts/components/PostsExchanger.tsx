import { useEffect, useState } from 'react'
import { Divider } from 'antd'

import { useAuth } from '@Common/hooks'
import { getPostsListsExchanger, PostModel } from '@Common/api'
import {
  PostsList,
  SearchAndFilter,
  SearchAndFilterProps,
} from '@Posts/components'
import { PageTitle } from '@Common/components'
import { mapCategoriesToSelectOptions, SelectOption } from '@Posts/helpers'

export function PostsExchanger() {
  const { user } = useAuth()

  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  function updatePosts(posts: PostModel[]) {
    // Quedarse solo con las publicaciones con estado
    // 'activo'
    setPosts(posts.filter(({ state }) => state.id === 1))
  }

  const handleSearch: SearchAndFilterProps['onSearch'] = async (values) => {
    setIsLoading(true)
    const searchPosts = await getPostsListsExchanger({
      excludeUserId: user!.id,
      status: 'activo',
      ...values,
    })
    updatePosts(searchPosts)
    setIsLoading(false)
  }

  useEffect(() => {
    mapCategoriesToSelectOptions('name').then((categories) =>
      setCategoriesOptions([...categoriesOptions, ...categories])
    )

    getPostsListsExchanger({ excludeUserId: user!.id, status: 'activo' }).then(
      (posts) => {
        updatePosts(posts)
        setIsLoading(false)
      }
    )
  }, [])

  return (
    <>
      <PageTitle title="Publicaciones" />
      <SearchAndFilter
        searchPlaceholder="Busca una publicación"
        disabled={isLoading}
        onSearch={handleSearch}
        filters={{
          category: {
            initialValue: '',
            options: categoriesOptions,
          },
          state: {
            initialValue: '',
            options: [
              { label: 'Todos los estados de producto', value: '' },
              { label: 'Nuevo', value: 'NUEVO' },
              { label: 'Usado', value: 'USADO' },
              { label: 'Defectuoso', value: 'DEFECTUOSO' },
            ],
          },
        }}
      />
      <Divider />
      <PostsList posts={posts} isLoading={isLoading} />
    </>
  )
}
