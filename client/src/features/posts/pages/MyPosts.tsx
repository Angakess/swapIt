import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import { getCategoryList, getPostList, PostModel } from '@Common/api'
import { PageTitle } from '@Common/components'
import { useAuth } from '@Common/hooks'
import { PostsList, SearchAndFilter, PostCreateModal } from '@Posts/components'

type SelectOption = {
  label: string
  value: string
}

async function mapCategoiresToSelectOptions(): Promise<SelectOption[]> {
  const categories = await getCategoryList()
  return categories.map(({ name }) => ({ label: name, value: name }))
}

export function MyPosts() {
  const { user } = useAuth()

  const [categoriesOptions, setCategoriesOption] = useState<SelectOption[]>([
    { label: 'Todas las categorías', value: '' },
  ])

  const [posts, setPosts] = useState<PostModel[]>([])
  const [haveNewPosts, setHaveNewPosts] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [filterCategory, setFilterCategory] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const [addPostIsOpen, setAddPostIsOpen] = useState(false)

  const handleSearch = useCallback(async () => {
    const p = await getPostList({
      userId: user!.id,
      search: searchValue,
      category: filterCategory,
      state: filterState,
      status: filterStatus,
    })
    setPosts(p.filter(({ state }) => state.id !== 5))
  }, [filterCategory, filterState, filterStatus, searchValue, user])

  useEffect(() => {
    ;(async () => {
      const categories = await mapCategoiresToSelectOptions()
      setCategoriesOption([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostList({
        userId: user!.id,
      })
      setPosts(p.filter(({ state }) => state.id <= 3))
      setIsLoading(false)
    })()
  }, [])

  // Actualizar listado en caso de crear un nuevo producto
  useEffect(() => {
    console.log('[useEffect] [handleSearch, haveNewPosts]')
    if (haveNewPosts) {
      setHaveNewPosts(false)
      handleSearch()
    }
  }, [handleSearch, haveNewPosts])

  useEffect(() => {
    console.log('[useEffect] [haveNewPosts]')
  }, [haveNewPosts])

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
            placeholder: 'Estado del producto',
            options: [
              { label: 'Todos los estados de producto', value: '' },
              { label: 'Nuevo', value: 'NUEVO' },
              { label: 'Usado', value: 'USADO' },
              { label: 'Defectuoso', value: 'DEFECTUOSO' },
            ],
            defaultValue: '',
            value: filterState,
            handleChange: setFilterState,
          },
          {
            placeholder: 'Estado de la publicación',
            options: [
              { label: 'Todos los estados de la publicación', value: '' },
              { label: 'Activo', value: 'activo' },
              { label: 'Pendiente', value: 'pendiente' },
              { label: 'Suspendido', value: 'suspendido' },
              { label: 'Rechazado', value: 'rechazado' },
            ],
            defaultValue: '',
            value: filterStatus,
            handleChange: setFilterStatus,
          },
        ]}
        handleSearch={handleSearch}
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
