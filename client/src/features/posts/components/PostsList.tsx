import { Col, Empty, Row } from 'antd'
import { PostListItem } from './PostListItem'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

export function PostsList({ posts }: { posts: PostModel[] }) {
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
