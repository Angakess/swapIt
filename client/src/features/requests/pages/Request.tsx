import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Calendar, Card, Col, Row, Spin, Typography } from 'antd'

import { RequestModel, getRequestById } from '@Common/api'
import { useAuth } from '@Common/hooks'
import { Page404 } from '@Common/pages'
import { PageTitle } from '@Common/components'
import { PostListItem, PostSubsidiary } from '@Posts/components'
import { RequestMainButton } from '@Requests/components'

export function Request() {
  const { id } = useParams()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [request, setRequest] = useState<RequestModel | null>(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const resp = await getRequestById(parseInt(id!, 10))
      setRequest(resp)
      setIsLoading(false)
    })()
  }, [id])

  // Si está cargando, mostrar spin de carga:
  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  // Si:
  // - la request no existe
  // - o el usuario no está involucrado
  // entonces: 404.
  if (
    request === null ||
    ![request.user_maker, request.user_receive].includes(user!.id)
  ) {
    return <Page404 />
  }

  // Cualquier otro caso, mostrar el componente:
  return (
    <>
      <PageTitle title="Detalle de solicitud" />
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Badge.Ribbon
            text="Propietario"
            style={{
              display: request.user_maker === user!.id ? 'inherit' : 'none',
            }}
          >
            <PostListItem post={request.post_maker} />
          </Badge.Ribbon>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Badge.Ribbon
            text="Propietario"
            style={{
              display: request.user_receive === user!.id ? 'inherit' : 'none',
            }}
          >
            <PostListItem post={request.post_receive} />
          </Badge.Ribbon>
        </Col>

        <Col xs={24} md={24} lg={8} style={{ maxHeight: '30rem' }}>
          <Card style={{ marginBottom: '1.5rem' }}>
            <RequestMainButton request={request} setRequest={setRequest} />
            <Typography.Paragraph style={{ margin: '1rem 0 0' }}>
              <Typography.Text strong>Estado solicitud: </Typography.Text>
              <Typography.Text>{request.state}</Typography.Text>
            </Typography.Paragraph>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={24}>
              <PostSubsidiary post={request.post_receive} />
            </Col>

            <Col xs={24} md={12} lg={24} style={{ marginBottom: '1.5rem' }}>
              <Card style={{ width: '100%' }}>
                <Typography.Title level={4}>Fecha</Typography.Title>
                <Typography.Text>
                  {new Date('2024-06-08 UTC-3').toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography.Text>
                <Calendar
                  fullscreen={false}
                  style={{ pointerEvents: 'none' }}
                  headerRender={() => undefined}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
