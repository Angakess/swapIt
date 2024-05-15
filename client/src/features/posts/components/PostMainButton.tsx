import { Button, Col, Row, theme } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'

import { useAuth } from '@Common/hooks'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

export function PostMainButton({ post }: { post: PostModel }) {
  const { user } = useAuth()
  const { colorSuccess } = theme.useToken().token

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return (
        <Button
          type="primary"
          block
          size="large"
          style={{ fontWeight: '700', marginBottom: '1.5rem' }}
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
      >
        Intercambiar
      </Button>
    )
  }

  if (post.state.name === 'activo') {
    return (
      <Button
        type="primary"
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        disabled
      >
        Publicación activa
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
        >
          Aprobar
        </Button>
      </Col>
      <Col xs={12}>
        <Button type="primary" danger block icon={<CloseOutlined />}>
          Rechazar
        </Button>
      </Col>
      <Col xs={24}>
        <Button danger block icon={<UserDeleteOutlined />}>
          Bloquear usuario
        </Button>
      </Col>
    </Row>
  )
}
