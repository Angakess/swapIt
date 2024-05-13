import { AuthTitle } from '@Auth/components'
import { ConfirmPasswordItem, SubmitItem } from '@Auth/components/items'
import { Form, Button, FormProps } from 'antd'

export function NewPassword() {
  const handleFinish: FormProps['onFinish'] = (values) => {
    console.log('Success: ', values)
  }
  const handleFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed: ', errorInfo)
  }

  return (
    <>
      <AuthTitle>Cambio de contraseña</AuthTitle>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        <ConfirmPasswordItem />

        <SubmitItem
          text="Actualizar contraseña"
          style={{ marginTop: '0.5rem' }}
        />

        <Form.Item>
          <Button
            type="link"
            size="large"
            // ni idea si esto esta bien
            href="/auth/login"
            style={{
              display: 'block',
              margin: 'auto',
              marginTop: '0.5rem',
              width: '25%',
            }}
          >
            Volver
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
