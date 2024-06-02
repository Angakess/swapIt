import { PageTitle } from '@Common/components'
import {
  PostListWithSearch,
  PostListWithSearchProps,
} from './PostListWithSearch'
import { useCallback, useState } from 'react'
import { PostModel, StateModel, getPostsListsExchanger } from '@Common/api'
import { useAuth } from '@Common/hooks'

const filterStates: StateModel['name'][] = ['activo']

export function PostsExchanger() {
  const { user } = useAuth()

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts: PostListWithSearchProps['fetchPosts'] = useCallback(
    (values) => {
      return getPostsListsExchanger({
        excludeUserId: user!.id,
        status: 'activo',
        ...values,
      })
    },
    [user]
  )

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
        initialFetchPostsStatus="activo"
      />
    </>
  )
}
