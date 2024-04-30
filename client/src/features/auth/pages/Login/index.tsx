import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Flex, Form, Input, InputNumber, Typography } from 'antd'

import { AuthTitle } from '@Auth/components'
import { Link } from 'react-router-dom'

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
            autoFocus
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
            <Link to="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" size="large">
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
      <Typography>
        ¿No tenés una cuenta? <Link to="/auth/register">Crear cuenta</Link>
      </Typography>
    </>
  )
}
