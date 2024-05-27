import { Alert, Card, Col, Row, Spin, Typography, theme } from 'antd'
import { useParams } from 'react-router-dom'
import {
  ImageCarousel,
  PostDetails,
  PostMainButton,
  PostUser,
} from '@Posts/components'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Page404 } from '@Common/pages'
import { useEffect, useState } from 'react'
import { PostModel, getPostById } from '@Posts/helpers/getPostsListsExchanger'
import { useAuth } from '@Common/hooks'

export function Post() {
  const { user } = useAuth()

  const { borderRadiusLG } = theme.useToken().token
  const { id } = useParams()

  const [post, setPost] = useState<PostModel | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      let p: PostModel | null = null

      try {
        p = await getPostById(Number(id))
      } catch {
        p = null
      } finally {
        setPost(p)
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (isLoading || post === null) return

    const arr = Object.entries(post)
      .filter(([key, value]) => key.startsWith('image_') && value != null)
      .map(([, value]) => value) as string[]

    setImages(arr)
  }, [post, isLoading])

  // Si está cargando, mostrar spin de carga:
  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  // Si:
  // - el post no existe
  // - fue eliminado
  // - no está activo y lo está viendo un intercambiador distinto al propietario
  if (
    post == null ||
    post.state.name === 'eliminado' ||
    (post!.user.id !== user!.id &&
      user!.role === 'EXCHANGER' &&
      post!.state.name !== 'activo')
  ) {
    return <Page404 />
  }

  // Cualquier otro caso, mostrar el componente:
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={14}>
          <div
            style={{
              overflow: 'hidden',
              borderRadius: borderRadiusLG,
              marginBottom: '1.5rem',
            }}
          >
            <ImageCarousel imagesUrls={images} imageHeight="400px" />
          </div>
          <PostAlert post={post!} />
        </Col>

        <Col xs={24} md={12} lg={10}>
          <Card
            style={{ width: '100%', marginBottom: '1.5rem' }}
            bordered={false}
          >
            <Typography.Title level={3}>{post!.name}</Typography.Title>
            <PostMainButton post={post!} />
            <PostDetails post={post!} />
          </Card>

          <Card style={{ marginBottom: '1.5rem' }}>
            <PostUser
              firstName={post!.user.first_name}
              lastName={post!.user.last_name}
            />
          </Card>

          <Card>
            <Typography.Title level={4}>Filial</Typography.Title>
            <MapContainer
              center={[
                Number(post!.subsidiary.x_coordinate),
                Number(post!.subsidiary.y_coordinate),
              ]}
              zoom={15}
              zoomControl={false}
              style={{ borderRadius: borderRadiusLG, height: '160px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[
                  Number(post!.subsidiary.x_coordinate),
                  Number(post!.subsidiary.y_coordinate),
                ]}
              />
            </MapContainer>
            <Typography.Text
              strong
              style={{ marginTop: '1rem', display: 'block' }}
            >
              {post!.subsidiary.name}
            </Typography.Text>
          </Card>
        </Col>
      </Row>
    </>
  )
}

function PostAlert({ post }: { post: PostModel }) {
  const { user } = useAuth()
  const { boxShadowTertiary } = theme.useToken().token

  if (post.user.id !== user!.id) return null

  if (post.state.name === 'pendiente') {
    return (
      <Alert
        message="Post pendiente"
        description="Este post está pendiente porque todavía no fue evaluado por un ayudante"
        type="warning"
        showIcon
        style={{ boxShadow: boxShadowTertiary }}
      />
    )
  }

  if (post.state.name === 'suspendido') {
    return (
      <Alert
        message="Post supsendido"
        description="Este post fue suspendido porque la filial a la pertenece o su categoría fueron suspendidas. Por favor, modifique la publicación para que pueda ser mostrada nuevamente"
        type="error"
        showIcon
        style={{ boxShadow: boxShadowTertiary }}
      />
    )
  }

  return null
}
