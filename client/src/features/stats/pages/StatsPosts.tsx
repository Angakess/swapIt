import {
  CategoryModel,
  PostModel,
  getCategoryList,
  getPostList,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import { StatPostsColumn } from '@Stats/components/posts'
import { Space } from 'antd'
import { useEffect, useState } from 'react'

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

      <Space direction="vertical" size={[24, 24]} style={{ display: 'flex' }}>
        <StatPostsColumn
          isLoading={isLoading}
          categories={categories}
          posts={posts}
        />
      </Space>
    </>
  )
}
