import { Button, Col, ConfigProvider, Dropdown, Row, theme } from 'antd'
import {
  DownOutlined,
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
  EditOutlined,
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
        <ConfigProvider theme={{ token: { colorPrimary: colorSuccess } }}>
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            menu={{
              items: [
                {
                  key: '1',
                  icon: <EditOutlined />,
                  label: 'Editar valor y aprobar',
                  onClick: () => console.log('[CLICK] Edtiar valor y aprobar'),
                },
              ],
            }}
            placement="bottom"
            onClick={() => console.log('[CLICK] Aprobar')}
          >
            <CheckOutlined /> Aprobar
          </Dropdown.Button>
        </ConfigProvider>
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
