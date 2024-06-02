import { useCallback, useEffect, useState } from 'react'
import { SearchAndFilter, SearchAndFilterProps } from './SearchAndFilter'
import { SelectOption, mapCategoriesToSelectOptions } from '@Posts/helpers'
import { Divider } from 'antd'
import { PostsList } from './PostsList'
import { PostModel, PostStateModel } from '@Common/api'

export type PostListWithSearchProps = {
  posts: PostModel[]
  setPosts: React.Dispatch<React.SetStateAction<PostModel[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  filterStates: PostStateModel['name'][]
  fetchPosts: (values: Record<string, string>) => Promise<PostModel[]>
  initialFetchPostsStatus?: PostStateModel['name'] | ''
  showStatus?: boolean
  additionalFilters?: SearchAndFilterProps['filters']
}

export function PostListWithSearch({
  posts,
  setPosts,
  isLoading,
  setIsLoading,
  filterStates,
  fetchPosts,
  initialFetchPostsStatus = '',
  showStatus = false,
  additionalFilters = {},
}: PostListWithSearchProps) {
  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const updatePosts = useCallback(
    (newPosts: PostModel[]) => {
      setPosts(
        newPosts.filter(({ state }) => filterStates.includes(state.name))
      )
    },
    [filterStates, setPosts]
  )

  const handleSearch: SearchAndFilterProps['onSearch'] = async (values) => {
    setIsLoading(true)
    const newPosts = await fetchPosts(values)
    updatePosts(newPosts)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      mapCategoriesToSelectOptions('name').then((categories) =>
        setCategoriesOptions([
          { label: 'Todas las categorías', value: '' },
          ...categories,
        ])
      ),
      fetchPosts({ status: initialFetchPostsStatus }).then(updatePosts),
    ]).finally(() => setIsLoading(false))
  }, [fetchPosts, initialFetchPostsStatus, setIsLoading, updatePosts])

  return (
    <>
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
          ...additionalFilters,
        }}
      />
      <Divider />
      <PostsList posts={posts} isLoading={isLoading} showStatus={showStatus} />
    </>
  )
}
