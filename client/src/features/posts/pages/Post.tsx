import { Alert, Card, Col, Row, Spin, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'

import { Page404 } from '@Common/pages'
import { getPostById } from '@Common/api/posts'
import { PostModel, StateModel } from '@Common/api/types'
import { useAuth } from '@Common/hooks'
import {
  ImageCarousel,
  PostDetails,
  PostMainButton,
  PostUser,
} from '@Posts/components'
import { getPostImagesArray } from '@Posts/helpers'

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
  }, [id])

  useEffect(() => {
    if (isLoading || post === null) return
    setImages(getPostImagesArray(post))
  }, [post, isLoading])

  // Si está cargando, mostrar spin de carga:
  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  // Si:
  // - el post no existe
  // - fue 'bloqueado', 'rechazado' o 'eliminado'
  // - lo está viendo un usuario distinto al propietario y no está activo
  // entonces: 404.

  // Estado de publicación: quién puede verla
  // activo:     cualquiera.
  // pendiente:  propietario y staff (para aprobar o rechazar).
  // suspendido: propietario.
  // bloqueado:  nadie.
  // rechazado:  nadie.
  // eliminado:  nadie.

  const invalidStates: StateModel['name'][] = [
    'bloqueado',
    'rechazado',
    'eliminado',
  ]

  if (
    post == null ||
    invalidStates.includes(post.state.name) ||
    (user!.role === 'EXCHANGER' &&
      post!.user.id !== user!.id &&
      post!.state.name !== 'activo') ||
    (user!.role !== 'EXCHANGER' &&
      post!.state.name !== 'activo' &&
      post!.state.name !== 'pendiente')
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
            <PostMainButton post={post!} setPost={setPost} />
            <PostDetails post={post!} />
          </Card>

          <Card style={{ marginBottom: '1.5rem' }}>
            <PostUser
              firstName={post!.user.first_name}
              lastName={post!.user.last_name}
            />
          </Card>

          <PostSubsidiary post={post} />
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

function PostSubsidiary({ post }: { post: PostModel }) {
  const { borderRadiusLG } = theme.useToken().token

  const [address, setAddress] = useState<string>('Cargando...')

  useEffect(() => {
    ;(async () => {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${post.subsidiary.x_coordinate}&lon=${post.subsidiary.y_coordinate}`
      )
      const data = await resp.json()

      if (resp.ok && data.address) {
        const { city, house_number, road, state, town } = data.address
        setAddress(`${road} #${house_number}, ${town || city}, ${state}.`)
      }
    })()
  }, [post.subsidiary.x_coordinate, post.subsidiary.y_coordinate])

  return (
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
      <Typography.Text strong style={{ marginTop: '1rem', display: 'block' }}>
        {post!.subsidiary.name}
      </Typography.Text>
      {address !== '' && (
        <Typography.Text type="secondary">{address}</Typography.Text>
      )}
    </Card>
  )
}
