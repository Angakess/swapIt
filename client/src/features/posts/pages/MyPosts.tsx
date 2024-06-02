import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider } from 'antd'
import { useEffect, useState } from 'react'

import { getPostList, PostModel } from '@Common/api'
import { PageTitle } from '@Common/components'
import { useAuth } from '@Common/hooks'
import {
  PostsList,
  SearchAndFilter,
  PostCreateModal,
  SearchAndFilterProps,
} from '@Posts/components'
import { mapCategoriesToSelectOptions, SelectOption } from '@Posts/helpers'

export function MyPosts() {
  const { user } = useAuth()

  const [categoriesOptions, setCategoriesOption] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [haveNewPosts, setHaveNewPosts] = useState(false)

  const [addPostIsOpen, setAddPostIsOpen] = useState(false)

  function updatePosts(posts: PostModel[]) {
    // Quedarse solo con las publicaciones con estado
    // 'activo', 'pendiente' o 'suspendido'
    setPosts(posts.filter(({ state }) => state.id <= 3))
  }

  const handleSearch: SearchAndFilterProps['onSearch'] = async (values) => {
    setIsLoading(true)
    const searchPosts = await getPostList({ userId: user!.id, ...values })
    updatePosts(searchPosts)
    setIsLoading(false)
  }

  useEffect(() => {
    mapCategoriesToSelectOptions('name').then((categories) =>
      setCategoriesOption([...categoriesOptions, ...categories])
    )

    getPostList({ userId: user!.id }).then((posts) => {
      updatePosts(posts)
      setIsLoading(false)
    })
  }, [])

  // Actualizar listado en caso de crear un nuevo producto
  useEffect(() => {
    if (haveNewPosts) {
      setHaveNewPosts(false)
      getPostList({ userId: user!.id }).then((posts) => {
        updatePosts(posts)
        setIsLoading(false)
      })
    }
  }, [haveNewPosts, user])

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
      <Divider />

      <PostsList posts={posts} isLoading={isLoading} showStatus />

      <PostCreateModal
        isOpen={addPostIsOpen}
        setIsOpen={setAddPostIsOpen}
        setHaveNewPosts={setHaveNewPosts}
      />
    </>
  )
}
