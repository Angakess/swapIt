import { Button, Col, Row, theme } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'

import { useAuth, useCustomAlerts } from '@Common/hooks'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

export function PostMainButton({ post }: { post: PostModel }) {
  const { user } = useAuth()
  const alerts = useCustomAlerts()
  const { colorSuccess } = theme.useToken().token

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return (
        <Button
          type="primary"
          block
          size="large"
          style={{ fontWeight: '700', marginBottom: '1.5rem' }}
          onClick={alerts.notImplementedYet}
        >
          Editar
        </Button>
      )
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
