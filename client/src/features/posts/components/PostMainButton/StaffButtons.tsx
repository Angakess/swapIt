import { Button, Col, Row, theme } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'
import { useCustomAlerts } from '@Common/hooks'
import { PostModel } from '@Common/api'

export function StaffButtons({ post }: { post: PostModel }) {
  const { colorSuccess } = theme.useToken().token
  const alerts = useCustomAlerts()

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
