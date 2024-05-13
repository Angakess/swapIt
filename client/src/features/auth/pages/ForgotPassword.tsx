import { Form, Button, FormProps, Flex, Typography, Spin, App } from 'antd'
import { AuthTitle } from '@Auth/components'
import { DniItem, SubmitItem } from '@Auth/components/items'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { fetchPost } from '@Common/helpers'

type ForgotPassData = {
  dni: string
}

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const { modal, notification } = App.useApp()
  const [form] = Form.useForm<ForgotPassData>()

  const onFinish: FormProps<ForgotPassData>['onFinish'] = async (values) => {
    setIsLoading(true)

    const resp = await fetchPost(
      'http://localhost:8000/users/forgot-password/',
      { dni: values.dni }
    )
    const data = await resp.json()

    if (resp.ok && data.ok) {
      modal.success({
        title: 'Código de recuperación enviado',
        content: <SuccessMesage />,
        onOk: () => navigate('/auth/login'),
      })
    } else {
      notification.error({
        message: 'Ocurrió un error al intentar recuperar la contraseña',
        description: data.messages.join('\n'),
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
    }

    setIsLoading(false)
  }

  return (
    <Spin tip="Cargando..." spinning={isLoading}>
      <AuthTitle>Recuperación de contraseña</AuthTitle>
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        disabled={isLoading}
      >
        <DniItem />

        <Form.Item>
          <Typography.Paragraph
            type="secondary"
            style={{ marginTop: '0.25rem' }}
          >
            Si el DNI coincide con una cuenta, le enviaremos un enlace de
            recuperación de contraseña a su correo.
          </Typography.Paragraph>
        </Form.Item>

        <SubmitItem text="Enviar" />
      </Form>

      <Flex justify="center">
        <Button type="link" size="small" disabled={isLoading}>
          <Link to="/auth/login">Volver a inicio de sesión</Link>
        </Button>
      </Flex>
    </Spin>
  )
}

function SuccessMesage() {
  return (
    <>
      <Typography.Paragraph>
        Se envió un correo con un código de recuperación de contraseña.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        <Typography.Text type="secondary" strong>
          Nota:
        </Typography.Text>{' '}
        Al hacer click en{' '}
        <Typography.Text type="secondary" italic>
          "ok"
        </Typography.Text>{' '}
        será redirigido a la página de inicio de sesión
      </Typography.Paragraph>
    </>
  )
}
