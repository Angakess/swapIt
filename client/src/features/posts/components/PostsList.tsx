import { Col, Row } from 'antd'
import { PostItem } from './PostItem'

export function PostsList() {
  return (
    <Row gutter={[12, 12]}>
      {Array.from({ length: 12 }, (_, index) => (
        <Col key={index} xs={24} md={12} lg={8}>
          <PostItem />
        </Col>
      ))}
    </Row>
  )
}
