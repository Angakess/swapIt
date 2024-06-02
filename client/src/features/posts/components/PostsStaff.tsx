import { useEffect, useState } from 'react'
import { Divider } from 'antd'

import { getPostList, PostModel } from '@Common/api'
import { PageTitle } from '@Common/components'
import { PostsList } from './PostsList'
import { SearchAndFilter, SearchAndFilterProps } from './SearchAndFilter'
import { mapCategoriesToSelectOptions, SelectOption } from '@Posts/helpers'

export function PostsStaff() {
  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  function updatePosts(posts: PostModel[]) {
    // Quedarse solo con las publicaciones con estado
    // 'activo' o 'pendiente'
    setPosts(posts.filter(({ state }) => state.id <= 2))
  }

  const handleSearch: SearchAndFilterProps['onSearch'] = async (values) => {
    setIsLoading(true)
    const searchPosts = await getPostList(values)
    updatePosts(searchPosts)
    setIsLoading(false)
  }

  useEffect(() => {
    mapCategoriesToSelectOptions('name').then((categories) =>
      setCategoriesOptions([...categoriesOptions, ...categories])
    )

    getPostList({ status: 'pendiente' }).then((posts) => {
      updatePosts(posts)
      setIsLoading(false)
    })
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
          status: {
            initialValue: 'pendiente',
            options: [
              { label: 'Todos los estados de la publicación', value: '' },
              { label: 'Activo', value: 'activo' },
              { label: 'Pendiente', value: 'pendiente' },
            ],
          },
        }}
      />
      <Divider />
      <PostsList posts={posts} isLoading={isLoading} showStatus />
    </>
  )
}
