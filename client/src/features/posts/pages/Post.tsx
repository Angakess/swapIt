import { Card, Col, Row, Typography, theme } from 'antd'
import { useParams } from 'react-router-dom'
import {
  ImageCarousel,
  PostDetails,
  PostMainButton,
  PostUser,
} from '@Posts/components'
import MOCK_POSTS from '@Posts/MOCK_POSTS.json'

export function Post() {
  const { borderRadiusLG } = theme.useToken().token
  const { id } = useParams()

  const post = MOCK_POSTS.posts.find((p) => p.id.toString() === id)

  if (!post) {
    return <>Post no existe</>
  }

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={14}>
          <ImageCarousel
            carouselProps={{ fade: true }}
            imagesUrls={post.images}
            imageHeight="400px"
            styles={{
              container: { borderRadius: borderRadiusLG, overflow: 'hidden' },
            }}
          />
        </Col>

        <Col xs={24} md={12} lg={10}>
          <Card
            style={{ width: '100%', marginBottom: '1.5rem' }}
            bordered={false}
          >
            <Typography.Title level={3}>{post.title}</Typography.Title>
            <PostMainButton />
            <PostDetails post={post} />
          </Card>

          <Card>
            <PostUser />
          </Card>
        </Col>
      </Row>
    </>
  )
}
