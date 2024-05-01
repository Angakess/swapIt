import { useState } from 'react'
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
} from 'antd'

import { AuthTitle } from '@Auth/components'
import { Link } from 'react-router-dom'

export function Register() {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  function togglePasswordVisibility() {
    setPasswordVisible(!isPasswordVisible)
  }

  return (
    <>
      <AuthTitle>Crear Cuenta</AuthTitle>
      <Form layout="vertical">
        {/* 
          [x] nombre
          [x] apellido
          [x] dni
          [x] correo
          [x] telefono
          [x] fecha nacimiento
          [x] genero
          [x] contraseña
          [x] confirmar contraseña
          [ ] boton crear
          [ ] ya tenes cuenta... iniciar sesion
        */}

        <Flex gap="1rem">
          <Form.Item label="Nombre">
            <Input placeholder="Nombre" size="large" autoFocus />
          </Form.Item>

          <Form.Item label="Apellido">
            <Input placeholder="Apellido" size="large" />
          </Form.Item>
        </Flex>

        <Form.Item label="DNI">
          <InputNumber
            placeholder="DNI"
            size="large"
            style={{ width: '100%' }}
            controls={false}
          />
        </Form.Item>

        <Form.Item label="Correo">
          <Input placeholder="Correo" size="large" />
        </Form.Item>

        <Form.Item label="Telefono">
          <Input placeholder="221 123-4567" size="large" />
        </Form.Item>

        <Form.Item label="Fecha de nacimiento">
          <DatePicker size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Género">
          <Select placeholder="Selecciona tu género" size="large">
            <Select.Option value="male">Masculino</Select.Option>
            <Select.Option value="female">Femenino</Select.Option>
            <Select.Option value="other">Otro</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Contraseña">
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

        <Form.Item label="Confirmar contraseña">
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
          <Button
            block
            type="primary"
            size="large"
            style={{ marginTop: '1rem' }}
          >
            Crear cuenta
          </Button>
        </Form.Item>
      </Form>
      <Typography>
        ¿Ya tenés una cuenta? <Link to="/auth/login">Iniciar sesión</Link>
      </Typography>
    </>
  )
}
