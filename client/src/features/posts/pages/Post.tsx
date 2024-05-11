import { Card, Col, Row, Typography, theme } from 'antd'
import { useParams } from 'react-router-dom'
import {
  ImageCarousel,
  PostDetails,
  PostMainButton,
  PostUser,
} from '@Posts/components'
import MOCK_POSTS from '@Posts/MOCK_POSTS.json'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

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

          <Card style={{ marginBottom: '1.5rem' }}>
            <PostUser />
          </Card>

          <Card>
            <Typography.Title level={4}>Filial</Typography.Title>
            <MapContainer
              center={[-34.9222141, -57.955808]}
              zoom={15}
              zoomControl={false}
              style={{ borderRadius: borderRadiusLG, height: '160px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[-34.9222141, -57.955808]}>
                <Popup>Filial Catedral</Popup>
              </Marker>
            </MapContainer>
            <Typography.Text
              strong
              style={{ marginTop: '1rem', display: 'block' }}
            >
              Filial catedral
            </Typography.Text>
          </Card>
        </Col>
      </Row>
    </>
  )
}
