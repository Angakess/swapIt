import { PostItem } from '@Posts/components'
import { Col, Row } from 'antd'

export function Posts() {
  return (
    <>
      <h2>Publicaciones</h2>
      <Row gutter={[12, 12]}>
        {Array.from({ length: 12 }, (_, index) => (
          <Col key={index} xs={24} md={12} lg={8}>
            <PostItem />
          </Col>
        ))}
      </Row>
    </>
  )
}
