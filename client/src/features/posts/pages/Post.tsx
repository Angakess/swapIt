import { Alert, Card, Col, Row, Spin, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { User } from '@Common/types'
import { getUserTurns, getPostById, PostModel } from '@Common/api'
import { useAuth } from '@Common/hooks'
import { Page404 } from '@Common/pages'
import {
  ImageCarousel,
  PostDetails,
  PostMainButton,
  PostSubsidiary,
  PostUser,
} from '@Posts/components'
import { getPostImagesArray } from '@Posts/helpers'

async function validatePostAccess(
  post: PostModel | null,
  user: User
): Promise<boolean> {
  // Estado de publicación: quién puede verla
  // activo:     cualquiera.
  // pendiente:  propietario y staff (para aprobar o rechazar).
  // suspendido: propietario y staff (para eliminar).
  // bloqueado:  nadie.
  // rechazado:  nadie.
  // eliminado:  nadie.
  // sin-stock:  propietario, staff y personas con las que tiene turno.

  // El post no existe.
  if (post == null) {
    return false
  }

  // El post está activo.
  if (post.state.name === 'activo') {
    return true
  }

  // El post está en un estado inaccesible (bloqueado, eliminado, rechazado).
  if (
    post.state.name === 'bloqueado' ||
    post.state.name === 'rechazado' ||
    post.state.name === 'eliminado'
  ) {
    return false
  }

  // El post está pendiente o suspendido y no es intercambiador o es el propietario
  // Ayudantes y el administrador general pueden verlo.
  if (post.state.name === 'pendiente' || post.state.name === 'suspendido') {
    return user.role !== 'EXCHANGER' || user.id === post.user.id
  }

  // El post está sin stock.
  // Si es el propietario o staff puede verlo
  // Si no, entonces es porque el usuario es intercambiador y solo puede verlo
  if (post.state.name === 'sin-stock') {
    if (user.role !== 'EXCHANGER' || user.id === post.user.id) return true
    const resp = await getUserTurns(user.id)

    // Si la publicación forma parte de alguno de sus turnos
    return resp.some(
      (turn) =>
        turn.post_receive.id === post.id || turn.post_maker.id === post.id
    )
  }

  // Fallback
  return false
}

export function Post() {
  const { user } = useAuth()

  const { borderRadiusLG } = theme.useToken().token
  const { id } = useParams()

  const [post, setPost] = useState<PostModel | null>(null)
  const [isEditable, setIsEditable] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValidAccess, setIsValidAccess] = useState(false)

  useEffect(() => {
    ;(async () => {
      let resp: { editable: boolean; post: PostModel } | null = null

      try {
        resp = await getPostById(Number(id))
      } catch {
        resp = null
      } finally {
        const isValid = await validatePostAccess(resp?.post ?? null, user!)
        setIsValidAccess(isValid)

        setPost(resp?.post ?? null)
        setIsEditable(resp?.editable ?? true)
        setIsLoading(false)
      }
    })()
  }, [id, user])

  useEffect(() => {
    if (isLoading || post === null) return
    setImages(getPostImagesArray(post))
  }, [post, isLoading])

  // Si está cargando, mostrar spin de carga:
  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  if (!isValidAccess) return <Page404 />

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
            <PostMainButton
              post={post!}
              setPost={setPost}
              isEditable={isEditable}
            />
            <PostDetails post={post!} />
          </Card>

          {/* FIXED: sai tenía razón */}
          {post!.user.id !== user!.id && (
            <Card style={{ marginBottom: '1.5rem' }}>
              <PostUser
                userId={post!.user.id}
                firstName={post!.user.first_name}
                lastName={post!.user.last_name}
              />
            </Card>
          )}

          <PostSubsidiary post={post!} />
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
