import { PlusOutlined } from '@ant-design/icons'
import { getPostList, PostModel, StateModel } from '@Common/api'
import { PageTitle } from '@Common/components'
import { useAuth } from '@Common/hooks'
import {
  PostCreateModal,
  PostListWithSearch,
  PostListWithSearchProps,
} from '@Posts/components'
import { Button } from 'antd'
import { useCallback, useState } from 'react'

const filterStates: StateModel['name'][] = ['activo', 'pendiente', 'suspendido']

export function MyPosts() {
  const { user } = useAuth()

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addPostIsOpen, setAddPostIsOpen] = useState(false)

  const fetchPosts: PostListWithSearchProps['fetchPosts'] = useCallback(
    (values) => {
      return getPostList({ userId: user!.id, ...values })
    },
    [user]
  )

  return (
    <>
      <PageTitle
        title="Mis publicaciones"
        right={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddPostIsOpen(true)}
          >
            Agregar
          </Button>
        }
      />
      <PostListWithSearch
        posts={posts}
        setPosts={setPosts}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        filterStates={filterStates}
        fetchPosts={fetchPosts}
        showStatus
        additionalFilters={{
          status: {
            initialValue: '',
            options: [
              { label: 'Todos los estados de la publicación', value: '' },
              { label: 'Activo', value: 'activo' },
              { label: 'Pendiente', value: 'pendiente' },
              { label: 'Suspendido', value: 'suspendido' },
            ],
          },
        }}
      />
      <PostCreateModal
        isOpen={addPostIsOpen}
        setIsOpen={setAddPostIsOpen}
        setPosts={setPosts}
      />
    </>
  )
}
