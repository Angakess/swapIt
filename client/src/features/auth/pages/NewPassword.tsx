import { AuthTitle } from '@Auth/components'
import { ConfirmPasswordItem, SubmitItem } from '@Auth/components/items'
import { fetchPost } from '@Common/helpers'
import { Form, Button, FormProps, Flex, Spin, App, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

type ResetPassData = {
  password: string
  confirmPassword: string
}

export function NewPassword() {
  const [isLoading, setIsLoading] = useState(false)

  const { code } = useParams()
  const navigate = useNavigate()

  const { modal, notification } = App.useApp()
  const [form] = Form.useForm<ResetPassData>()

  const handleFinish: FormProps['onFinish'] = async (values) => {
    setIsLoading(true)

    const resp = await fetchPost(
      'http://localhost:8000/users/reset-password/',
      { code, password: values.password }
    )
    const data = await resp.json()

    if (resp.ok && data.ok) {
      modal.success({
        title: 'Contraseña establecida con éxito',
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
      <AuthTitle>Cambio de contraseña</AuthTitle>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
        disabled={isLoading}
      >
        <ConfirmPasswordItem />

        <SubmitItem
          text="Actualizar contraseña"
          style={{ marginTop: '0.5rem' }}
        />
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
        Tu contraseña ha sido actualizada. Ya podés iniciar sesión con la nueva
        contraseña.
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
