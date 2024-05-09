import { StarFilled } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Space,
  Typography,
  theme,
} from 'antd'
import { useParams } from 'react-router-dom'
import MOCK_POSTS from '@Posts/MOCK_POSTS.json'
import { ImageCarousel } from '@Posts/components'

export function Post() {
  const { colorPrimary, borderRadiusLG } = theme.useToken().token

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
            <Button
              type="primary"
              block
              size="large"
              style={{ fontWeight: '700', marginBottom: '1.5rem' }}
            >
              Intercambiar
            </Button>

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
          </Card>

          <Card>
            <Flex justify="space-between">
              <Space>
                <Avatar size="large">JD</Avatar>
                <Typography.Text strong>John Doe</Typography.Text>
              </Space>
              <Space>
                <StarFilled style={{ color: colorPrimary, fontSize: '1rem' }} />
                <Typography.Text>
                  4.7{' '}
                  <Typography.Text italic type="secondary">
                    (15)
                  </Typography.Text>
                </Typography.Text>
              </Space>
            </Flex>
          </Card>
        </Col>
      </Row>
    </>
  )
}
