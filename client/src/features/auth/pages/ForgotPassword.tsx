import { Form, Button, FormProps } from 'antd'
import { AuthTitle } from '@Auth/components'
import { DniItem, SubmitItem } from '@Auth/components/items'

export function ForgotPassword() {
  const onFinish: FormProps['onFinish'] = (values) => {
    console.log('Success: ', values)
  }

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed: ', errorInfo)
  }

  return (
    <>
      <AuthTitle>Recuperación de contraseña</AuthTitle>
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <DniItem />

        <Form.Item>
          <p>
            Enviaremos un código de recuperación por email si el DNI ingresado
            coincide con una cuenta de SwapIt existente
          </p>
        </Form.Item>
        <SubmitItem text="Enviar" style={{ marginTop: '0.5rem' }} />
        <Form.Item>
          <Button
            type="link"
            size="large"
            // ni idea si esto esta bien
            href="/auth/login"
            style={{ display: 'block', margin: 'auto', marginTop: '0.5rem' }}
          >
            Volver
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
