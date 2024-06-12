import { Col, Empty, Flex, Pagination, Row, Spin } from 'antd'
import { PostModel } from '@Common/api'
import { PostListItem } from './PostListItem'
import React, { useEffect, useRef, useState } from 'react'

const PAGE_SIZE = 12

export function PostsList({
  posts,
  isLoading,
  showStatus = false,
}: {
  posts: PostModel[]
  isLoading: boolean
  showStatus?: boolean
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  if (posts.length === 0) {
    return <Empty description="No se encontraron publicaciones" />
  }

  return (
    <>
      <Row gutter={[12, 12]} ref={rowRef}>
        {posts
          .slice(
            (currentPage - 1) * PAGE_SIZE,
            (currentPage - 1) * PAGE_SIZE + PAGE_SIZE
          )
          .map((post) => (
            <Col key={post.id} xs={24} md={12} lg={8}>
              <PostListItem
                post={post}
                showStatus={showStatus}
                disableCarousel
              />
            </Col>
          ))}
      </Row>
      <Row>
        <Flex justify="center" style={{ width: '100%', margin: '1.5rem 0' }}>
          <Pagination
            total={posts.length}
            pageSize={12}
            current={currentPage}
            showSizeChanger={false}
            onChange={(page) => {
              setCurrentPage(page)
              document
                .getElementById('AppLayoutHeader')!
                .scrollIntoView({ behavior: 'instant', block: 'start' })
            }}
          />
        </Flex>
      </Row>
    </>
  )
}
