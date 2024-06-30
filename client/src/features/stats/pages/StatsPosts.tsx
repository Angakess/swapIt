import { Empty, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'

import {
  CategoryModel,
  PostModel,
  getCategoryList,
  getPostList,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import { StatPostsColumn } from '@Stats/components/posts'

export function StatsPosts() {
  const [posts, setPosts] = useState<PostModel[]>([])
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const [c, p] = await Promise.all([getCategoryList(), getPostList()])
      setCategories(c)
      setPosts(p)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Estadísticas de publicaciones" />

      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : posts.length === 0 || categories.length === 0 ? (
        <Empty description="No hay publicaciones disponibles para mostrar estadísticas." />
      ) : (
        <Space direction="vertical" size={[24, 24]} style={{ display: 'flex' }}>
          <StatPostsColumn
            isLoading={isLoading}
            categories={categories}
            posts={posts}
          />
        </Space>
      )}
    </>
  )
}
