import { Col, Row, Typography } from 'antd'
import { Post } from '@Common/types'

export function PostDetails({ post }: { post: Post }) {
  return (
    <>
      <Typography.Title level={4}>Detalles</Typography.Title>

      <Typography.Paragraph style={{ whiteSpace: 'pre-line' }}>
        {post.description}
      </Typography.Paragraph>

      <Row>
        <Col xs={6} style={{ marginBottom: '0.5rem' }}>
          <Typography.Text strong>Estado:</Typography.Text>
        </Col>
        <Col>{post.state}</Col>
      </Row>

      <Row>
        <Col xs={6}>
          <Typography.Text strong>Categoría:</Typography.Text>
        </Col>
        <Col>{post.category}</Col>
      </Row>
    </>
  )
}
