import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, ButtonProps, Col, ConfigProvider, Row, theme } from 'antd'

export function AcceptRejectButton({
  disabled,
  acceptProps,
  rejectProps,
}: {
  disabled: boolean
  acceptProps?: ButtonProps
  rejectProps?: ButtonProps
}) {
  const { colorSuccess } = theme.useToken().token

  return (
    <Row gutter={[12, 12]}>
      {/* Botón aceptar */}
      <Col xs={24} sm={12} lg={24}>
        <ConfigProvider theme={{ token: { colorPrimary: colorSuccess } }}>
          <Button
            {...acceptProps}
            type="primary"
            block
            disabled={disabled}
            icon={<CheckOutlined />}
          >
            Aceptar
          </Button>
        </ConfigProvider>
      </Col>

      {/* Botón rechazar */}
      <Col xs={24} sm={12} lg={24}>
        <Button
          {...rejectProps}
          type="primary"
          block
          danger
          disabled={disabled}
          icon={<CloseOutlined />}
        >
          Rechazar
        </Button>
      </Col>
    </Row>
  )
}
