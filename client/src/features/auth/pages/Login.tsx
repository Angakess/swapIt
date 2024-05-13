import { Link, useNavigate } from 'react-router-dom'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Form, Input, Typography, FormProps, Spin, App } from 'antd'
import { AuthTitle } from '@Auth/components'
import { useState } from 'react'
import { fetchPost } from 'common/helpers'
import { User, UserRole } from '@Common/types'
import { useAuth } from '@Common/hooks'
import { DniItem, ForgotPasswordItem } from '@Auth/components/items'

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
      if (user.role !== 'HELPER') {
        authContext.logIn(user)
      }
      const redirections: Record<UserRole, string> = {
        ADMIN: '/admin/helpers',
        HELPER: '/auth/verification',
        EXCHANGER: '/posts',
      }
      navigate(redirections[user.role])
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

        <Form.Item
          label="Contraseña"
          name="password"
          required={false}
          rules={[
            { required: true, message: 'Porfavor ingrese su contraseña' },
          ]}
          style={{ marginBottom: '0.25rem' }}
        >
          <Input.Password
            placeholder="Ingrese su contraseña"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <ForgotPasswordItem disabled={isLoading} />

        <Form.Item>
          <Button
            block
            type="primary"
            size="large"
            htmlType="submit"
            style={{ marginTop: '0.5rem' }}
          >
            Iniciar sesión
          </Button>
        </Form.Item>
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
