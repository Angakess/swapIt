import { AuthTitle } from '@Auth/components'
import { Form, Input, Button, FormProps } from 'antd'
import { RuleObject } from 'antd/es/form'

export function Verification() {
  const codeValidator = (_: RuleObject, value: any) => {
    const format = /[`!@#$%^()_+\-=\[\]{};':"\\|,.<>\/?~]/
    if (!value || !format.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Hay uno o más caracteres inválidos'))
  }

  const handleFinish: FormProps['onFinish'] = (values) => {
    console.log('Success: ', values)
  }
  const handleFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed: ', errorInfo)
  }

  return (
    <>
      <AuthTitle>Verificación</AuthTitle>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        <Form.Item
          name="code"
          rules={[
            { required: true, message: 'Por favor ingrese un código' },
            { validator: codeValidator },
          ]}
        >
          <Input.OTP
            size="large"
            style={{ width: '100%' }}
            autoFocus
            formatter={(str) => str.toUpperCase()}
          />
        </Form.Item>

        <Form.Item>
          <p>
            Por favor, ingrese el código que le hemos enviado por correo para
            completar el proceso de inicio de sesión.
          </p>
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
