import { AuthTitle } from '@Auth/components'
import { Form, Input, Button } from 'antd'

export function Verification() {
  return (
    <>
      <AuthTitle>Verificación</AuthTitle>
      <Form layout="vertical">
        <Form.Item>
          <Input.OTP
            size="large" 
            style={{ width: '100%'}} 
            autoFocus
            formatter={(str) => str.toUpperCase()}   
          />
        </Form.Item>

        <Form.Item>
          <p>Por favor, ingrese el código que le hemos enviado por correo para completar el proceso de inicio de sesión.</p>
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            size="large"
            style={{ marginTop: '0.5rem' }}
          >
            Enviar
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="link"
            size="large"
            // ni idea si esto esta bien
            href="/auth/login"
            style={{ display: 'block', margin: 'auto', marginTop: '0.5rem', width: '25%'}}
          >
            Volver
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
