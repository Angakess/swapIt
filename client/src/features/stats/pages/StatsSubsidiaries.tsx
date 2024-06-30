import { Empty, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'

import {
  CategoryModel,
  PostModel,
  SubsidiaryModel,
  getCategoryList,
  getPostList,
  getSubsidiaries,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import {
  ColumnHelpersPerSubsidiary,
  ColumnPostsPerSubsidiary,
} from '@Stats/components/subsidiaries'

export function StatsSubsidiaries() {
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryModel[]>([])
  const [posts, setPosts] = useState<PostModel[]>([])
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const [s, p, c] = await Promise.all([
        getSubsidiaries(),
        getPostList(),
        getCategoryList(),
      ])
      setSubsidiaries(s)
      setPosts(p)
      setCategories(c)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Estadísticas de filiales" />

      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : subsidiaries.length === 0 ||
        posts.length === 0 ||
        categories.length === 0 ? (
        <Empty description="No hay filiales disponibles para mostrar estadísticas." />
      ) : (
        <Space direction="vertical" size={[24, 24]} style={{ display: 'flex' }}>
          <ColumnHelpersPerSubsidiary
            isLoading={isLoading}
            subsidiaries={subsidiaries}
          />
          <ColumnPostsPerSubsidiary
            isLoading={isLoading}
            subsidiaries={subsidiaries}
            posts={posts}
            categories={categories}
          />
        </Space>
      )}
    </>
  )
}
