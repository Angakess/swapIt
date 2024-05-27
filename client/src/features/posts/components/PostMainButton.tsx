import { App, Button, Col, Popconfirm, Row, theme } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { useAuth, useCustomAlerts } from '@Common/hooks'
import { PostModel } from '@Common/api'
import { SERVER_URL } from 'constants'

export function PostMainButton({ post }: { post: PostModel }) {
  const { user } = useAuth()
  const alerts = useCustomAlerts()
  const { colorSuccess } = theme.useToken().token

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return <OwnerButtons post={post} />
    }

    return (
      <Button
        type="primary"
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        onClick={alerts.notImplementedYet}
      >
        Intercambiar
      </Button>
    )
  }

  if (post.state.name === 'activo') {
    return (
      <Button
        type="primary"
        danger
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        onClick={alerts.notImplementedYet}
      >
        Dar de baja publicación
      </Button>
    )
  }

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: '1.5rem' }}>
      <Col xs={12}>
        <Button
          type="primary"
          block
          icon={<CheckOutlined />}
          style={{ backgroundColor: colorSuccess, boxShadow: 'none' }}
          onClick={alerts.notImplementedYet}
        >
          Aprobar
        </Button>
      </Col>
      <Col xs={12}>
        <Button
          type="primary"
          danger
          block
          icon={<CloseOutlined />}
          onClick={alerts.notImplementedYet}
        >
          Rechazar
        </Button>
      </Col>
      <Col xs={24}>
        <Button
          danger
          block
          icon={<UserDeleteOutlined />}
          onClick={alerts.notImplementedYet}
        >
          Bloquear usuario
        </Button>
      </Col>
    </Row>
  )
}

function OwnerButtons({ post }: { post: PostModel }) {
  const { notification } = App.useApp()
  const alerts = useCustomAlerts()
  const navigate = useNavigate()

  async function deletePost() {
    const resp = await fetch(`${SERVER_URL}/post/remove/${post.id}`, {
      method: 'DELETE',
    })
    const data = await resp.json()

    if (resp.ok && data.ok) {
      notification.success({
        message: 'Publicación eliminada correctamente',
        description: 'La publicación ya no estará disponible',
        placement: 'topRight',
        duration: 3,
      })
      navigate('/posts/my-posts', { replace: true })
    } else {
      notification.error({
        message: 'Ocurrió un error al eliminar la publicación',
        description: data.messages.join('\n'),
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
    }
  }

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: '1.5rem' }}>
      <Col xs={24} sm={16}>
        <Button
          type="primary"
          block
          size="large"
          style={{ fontWeight: '700' }}
          onClick={alerts.notImplementedYet}
        >
          Editar
        </Button>
      </Col>
      <Col xs={24} sm={8}>
        <Popconfirm
          title="Eliminar publicación"
          description="¿Esta seguro que desea eliminar la publicación?"
          okText="Sí, eliminar publicación"
          cancelText="No, cancelar"
          okType="danger"
          placement="bottomLeft"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={deletePost}
        >
          <Button type="primary" danger block size="large">
            Eliminar
          </Button>
        </Popconfirm>
      </Col>
    </Row>
  )
}
