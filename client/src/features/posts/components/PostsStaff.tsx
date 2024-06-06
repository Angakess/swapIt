import { useState } from 'react'
import { PageTitle } from '@Common/components'
import { PostModel, PostStateModel, getPostList } from '@Common/api'
import {
  PostListWithSearch,
  PostListWithSearchProps,
} from './PostListWithSearch'

const filterStates: PostStateModel['name'][] = [
  'activo',
  'pendiente',
  'suspendido',
  'sin-stock',
]

const additionalFilters = {
  status: {
    initialValue: 'pendiente',
    options: [
      { label: 'Todos los estados de la publicación', value: '' },
      { label: 'Activo', value: 'activo' },
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Suspendido', value: 'suspendido' },
      { label: 'Sin stock', value: 'sin-stock' },
    ],
  },
}

const fetchPosts: PostListWithSearchProps['fetchPosts'] = (values) => {
  return getPostList(values)
}

export function PostsStaff() {
  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <PageTitle title="Publicaciones" />
      <PostListWithSearch
        posts={posts}
        setPosts={setPosts}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        filterStates={filterStates}
        fetchPosts={fetchPosts}
        initialFetchPostsStatus="pendiente"
        showStatus
        additionalFilters={additionalFilters}
      />
    </>
  )
}
