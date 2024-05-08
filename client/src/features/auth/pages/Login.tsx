import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Typography,
  FormProps,
} from 'antd'

import { AuthTitle } from '@Auth/components'
import { Link } from 'react-router-dom'
import { RuleObject } from 'antd/es/form'

export function Login() {
  const dniValidator = (_: RuleObject, value: number) => {
    if (!value || value.toString().length == 8) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('El DNI debe ser un número de 8 dígitos'))
  }

  const onFinish: FormProps['onFinish'] = (values) => {
    console.log('Success: ', values)
  }
  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed: ', errorInfo)
  }

  return (
    <>
      <AuthTitle>Iniciar sesión</AuthTitle>
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="DNI"
          name="dni"
          required={false}
          rules={[
            { required: true, message: 'Porfavor ingrese su DNI' },
            { validator: dniValidator },
          ]}
        >
          <InputNumber
            placeholder="Ingrese su DNI"
            size="large"
            style={{ width: '100%' }}
            controls={false}
            autoFocus
          />
        </Form.Item>

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

        <Form.Item>
          <Flex align="end" vertical>
            <Link to="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
          </Flex>
        </Form.Item>

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
        ¿No tenés una cuenta? <Link to="/auth/register">Crear cuenta</Link>
      </Typography>
    </>
  )
}
