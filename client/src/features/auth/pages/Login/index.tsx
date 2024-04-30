import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Flex, Form, Input, InputNumber, Typography } from 'antd'

import { AuthTitle } from '@Auth/components'

export function Login() {
  return (
    <>
      <AuthTitle>Iniciar sesión</AuthTitle>
      <Form layout="vertical">
        <Form.Item label="DNI">
          <InputNumber
            placeholder="DNI"
            size="large"
            style={{ width: '100%' }}
            controls={false}
          />
        </Form.Item>

        <Form.Item label="Contraseña" style={{ marginBottom: '0.25rem' }}>
          <Input.Password
            placeholder="Contraseña"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item>
          <Flex align="end" vertical>
            <Typography.Link>¿Olvidaste tu contraseña?</Typography.Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" size="large">
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
      <Typography>
        ¿No tenés una cuenta?{' '}
        <Typography.Link strong>Crear cuenta</Typography.Link>
      </Typography>
    </>
  )
}
