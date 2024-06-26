import { useEffect, useState } from 'react'
import { Col, Row, Space, Spin } from 'antd'

import {
  CategoryModel,
  PostModel,
  getCategoryList,
  getPostList,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import { CategoryPie, StatCategoriesColumn } from '@Stats/components/categories'

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
        <StatCategoriesColumn
          isLoading={isLoading}
          categories={categories}
          posts={posts}
        />

        <Row gutter={[12, 12]}>
          {isLoading ? (
            <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
          ) : (
            categories.map((category) => (
              <Col xs={24} md={12} key={category.name}>
                <CategoryPie
                  category={category.name}
                  posts={posts}
                  isLoading={isLoading}
                />
              </Col>
            ))
          )}
        </Row>
      </Space>
    </>
  )
}
