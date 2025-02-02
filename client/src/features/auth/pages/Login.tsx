import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Typography, FormProps, Spin, App } from 'antd'
import { AuthTitle } from '@Auth/components'
import { useState } from 'react'
import { fetchPost } from 'common/helpers'
import { User } from '@Common/types'
import { useAuth } from '@Common/hooks'
import {
  DniItem,
  ForgotPasswordItem,
  SinglePasswordItem,
  SubmitItem,
} from '@Auth/components/items'

type LoginFormData = {
  dni: string
  password: string
}

export function Login() {
  const authContext = useAuth()
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const [form] = Form.useForm<LoginFormData>()

  const [isLoading, setIsLoading] = useState(false)

  const handleFinish: FormProps<LoginFormData>['onFinish'] = async (values) => {
    setIsLoading(true)
    const resp = await fetchPost<LoginFormData>(
      'http://localhost:8000/users/login/',
      { ...values }
    )
    const data = await resp.json()
    const user = data.data.user as User

    if (resp.ok && data.ok) {
      if (user.role === 'EXCHANGER') {
        authContext.logIn(user)
        navigate('/posts', { replace: true })
      } else {
        navigate('/auth/verification', { state: data.data })
      }
    } else {
      notification.error({
        message: 'Ocurrió un error al intentar iniciar sesión',
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
      <AuthTitle>Iniciar sesión</AuthTitle>

      <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
        disabled={isLoading}
      >
        <DniItem autoFocus />
        <SinglePasswordItem />
        <ForgotPasswordItem disabled={isLoading} />
        <SubmitItem text="Iniciar sesión" style={{ marginTop: '0.5rem' }} />
      </Form>

      <Typography style={{ textAlign: 'center' }}>
        ¿No tenés una cuenta?
        <Button type="link" size="small" disabled={isLoading}>
          <Link to="/auth/register">Crear cuenta</Link>
        </Button>
      </Typography>
    </Spin>
  )
}
