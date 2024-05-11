import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  FormProps,
} from 'antd'
import { AuthTitle } from '@Auth/components'
import { dateValidator, dniValidator, phoneValidator } from 'helpers/validators'

export function Register() {
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
      <AuthTitle>Crear Cuenta</AuthTitle>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        <Flex gap="1rem">
          <Form.Item
            label="Nombre"
            name="firstName"
            required={false}
            rules={[{ required: true, message: 'Ingrese su nombre' }]}
          >
            <Input placeholder="Nombre" size="large" autoFocus />
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="lastName"
            required={false}
            rules={[{ required: true, message: 'Ingrese su apellido' }]}
          >
            <Input placeholder="Apellido" size="large" />
          </Form.Item>
        </Flex>

        <Form.Item
          label="DNI"
          name="dni"
          required={false}
          rules={[
            { required: true, message: 'Ingrese su DNI' },
            { validator: dniValidator },
          ]}
        >
          <InputNumber
            placeholder="DNI"
            size="large"
            style={{ width: '100%' }}
            controls={false}
          />
        </Form.Item>

        <Form.Item
          label="Correo"
          name="email"
          required={false}
          rules={[
            { required: true, message: 'Ingrese su email' },
            { type: 'email', message: 'No es un mail valido' },
          ]}
        >
          <Input placeholder="Correo" size="large" />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="phone"
          required={false}
          rules={[
            { required: true, message: 'Ingrese su número de teléfono' },
            { validator: phoneValidator },
          ]}
        >
          <Input placeholder="221 123-4567" size="large" />
        </Form.Item>

        <Form.Item
          label="Fecha de nacimiento"
          name="birthday"
          required={false}
          rules={[
            { required: true, message: 'Ingrese su fecha de nacimiento' },
            { validator: dateValidator },
          ]}
        >
          <DatePicker size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Género"
          name="gender"
          required={false}
          rules={[{ required: true, message: 'Seleccione una opción' }]}
        >
          <Select placeholder="Selecciona tu género" size="large">
            <Select.Option value="male">Masculino</Select.Option>
            <Select.Option value="female">Femenino</Select.Option>
            <Select.Option value="other">Otro</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Contraseña"
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

        <Form.Item>
          <Button block type="primary" size="large" htmlType="submit">
            Crear cuenta
          </Button>
        </Form.Item>
      </Form>
      <Typography style={{ textAlign: 'center' }}>
        ¿Ya tenés una cuenta? <Link to="/auth/login">Iniciar sesión</Link>
      </Typography>
    </>
  )
}
