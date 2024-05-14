import { Col, Row } from 'antd'
import { PostItem } from './PostItem'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

export function PostsList({ posts }: { posts: PostModel[] }) {
  return (
    <Row gutter={[12, 12]}>
      {posts.map((post) => (
        <Col key={post.id} xs={24} md={12} lg={8}>
          <PostItem post={post} />
        </Col>
      ))}
    </Row>
  )
}
