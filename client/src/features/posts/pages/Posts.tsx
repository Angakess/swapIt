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

  useEffect(() => {
    ;(async () => {
      const categories = await mapCategoiresToSelectOptions()
      setCategoriesFilter([...categoriesOptions, ...categories])
    })()
    ;(async () => {
      const p = await getPostsListsExchanger({ excludeUserId: user!.id })
      setPosts(p)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Publicaciones" />
      <SearchAndFilter
        searchBar={{ placeholder: 'Busca un producto' }}
        filters={[
          {
            placeholder: 'Categoría',
            options: categoriesOptions,
            defaultValue: '',
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
          },
        ]}
      />
      <Divider />
      <PostsList posts={posts} />
    </>
  )
}
