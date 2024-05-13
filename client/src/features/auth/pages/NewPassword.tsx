import { AuthTitle } from '@Auth/components'
import { SubmitItem } from '@Auth/components/items'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Form, Input, Button, FormProps } from 'antd'
import { useState } from 'react'

export function NewPassword() {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  function togglePasswordVisibility() {
    setPasswordVisible(!isPasswordVisible)
  }

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
        <Form.Item
          label="Nueva contraseña"
          name="password"
          required={false}
          rules={[{ required: true, message: 'Ingrese su contraseña' }]}
        >
          <Input.Password
            placeholder="Contraseña"
            size="large"
            visibilityToggle={{
              visible: isPasswordVisible,
              onVisibleChange: togglePasswordVisibility,
            }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
          name="confirmPassword"
          dependencies={['password']}
          required={false}
          rules={[
            { required: true, message: 'Confirme su contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error(
                    'No coincide con la contraseña ingresada previamente'
                  )
                )
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirmar contraseña"
            size="large"
            visibilityToggle={{
              visible: isPasswordVisible,
              onVisibleChange: togglePasswordVisibility,
            }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

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
