import { Col, Empty, Row, Spin } from 'antd'
import { PostListItem } from './PostListItem'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

export function PostsList({
  posts,
  isLoading,
}: {
  posts: PostModel[]
  isLoading: boolean
}) {
  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  if (posts.length === 0) {
    return <Empty description="No se encontraron publicaciones" />
  }

  return (
    <Row gutter={[12, 12]}>
      {posts.map((post) => (
        <Col key={post.id} xs={24} md={12} lg={8}>
          <PostListItem post={post} />
        </Col>
      ))}
    </Row>
  )
}
