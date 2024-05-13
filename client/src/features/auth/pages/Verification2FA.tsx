import { Form, Input, Button, FormProps, Flex, Typography, App } from 'antd'
import { AuthTitle } from '@Auth/components'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { User } from '@Common/types'
import { useAuth } from '@Common/hooks'

type Verification2faData = {
  code: string
}

type LocationState = {
  '2FA CODE': number
  user: User
}

export function Verification2FA() {
  const { logIn } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LocationState | null

  const { notification } = App.useApp()
  const [form] = Form.useForm<Verification2faData>()

  // Limpiar el código 2FA
  useEffect(() => {
    window.history.replaceState({}, '')
  }, [])

  const handleFinish: FormProps['onFinish'] = (values) => {
    if (values.code === locationState!['2FA CODE'].toString()) {
      logIn(locationState!.user)
      navigate('/posts', { replace: true })
    } else {
      notification.error({
        message: 'Código inválido',
        description:
          'El código ingresado no coincide con el código de verificación',
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
    }
  }

  if (!locationState) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <>
      <AuthTitle>Verificación 2FA</AuthTitle>
      <Form layout="vertical" onFinish={handleFinish} form={form}>
        <Form.Item
          name="code"
          rules={[
            { required: true, message: 'Por favor ingrese un código' },
            { len: 6, message: 'El código debe ser de 6 dígitos' },
            { pattern: /^\d+$/, message: 'El código debe ser un número' },
          ]}
        >
          <Input size="large" placeholder="Código de autenticación" />
        </Form.Item>
        <Form.Item>
          <Typography.Paragraph
            type="secondary"
            style={{ marginTop: '0.25rem' }}
          >
            Por favor, ingrese el código que le hemos enviado por correo para
            completar el proceso de inicio de sesión
          </Typography.Paragraph>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" size="large">
            Enviar
          </Button>
        </Form.Item>
      </Form>
      <Flex justify="center">
        <Button type="link" size="small">
          <Link to="/auth/login">Volver a iniciar sesión</Link>
        </Button>
      </Flex>
    </>
  )
}
