import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Link, useNavigate } from 'react-router-dom'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import {
  App,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  FormProps,
  Spin,
} from 'antd'
import { AuthTitle } from '@Auth/components'
import {
  dateValidator,
  dniValidator,
  phoneValidator,
} from '@Common/helpers/validators'
import { fetchPost } from 'common/helpers'
import { UserGender, UserRole } from '@Common/types'

type LoginBody = {
  first_name: string
  last_name: string
  dni: string
  email: string
  gender: UserGender
  date_of_birth: string
  phone_number: string
  password: string
  role: UserRole
}

type RegisterFormData = {
  first_name: string
  last_name: string
  dni: string
  email: string
  gender: UserGender
  date_of_birth: Dayjs
  phone_number: string
  password: string
  confirmPassword: string
}

export function Register() {
  const navigate = useNavigate()

  const { modal, notification } = App.useApp()
  const [form] = Form.useForm<RegisterFormData>()

  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      first_name: 'John',
      last_name: 'Doe',
      dni: '12345678',
      email: 'jdoe@mail.com',
      gender: 'MALE',
      phone_number: '2211234567',
      date_of_birth: dayjs('12/11/2001', 'DD/MM/YYYY'),
      password: '1234',
      confirmPassword: '1234',
    })
  }, [])

  function togglePasswordVisibility() {
    setPasswordVisible(!isPasswordVisible)
  }

  const handleFinish: FormProps<RegisterFormData>['onFinish'] = async (
    fields
  ) => {
    setIsLoading(true)
    const resp = await fetchPost<LoginBody>(
      'http://localhost:8000/users/create/',
      {
        ...fields,
        date_of_birth: fields.date_of_birth.format('YYYY-MM-DD'),
        role: 'EXCHANGER',
      }
    )
    const data = await resp.json()
    if (resp.ok && data.ok) {
      modal.success({
        title: 'Cuenta registrada con éxito',
        content: <SuccessMesage email={fields.email} />,
        onOk: () => navigate('/auth/login'),
      })
    } else {
      notification.error({
        message: 'Ocurrió un error al intentar registrar la cuenta',
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
      <AuthTitle>Crear Cuenta</AuthTitle>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        disabled={isLoading}
        form={form}
      >
        <Flex gap="1rem">
          <Form.Item
            label="Nombre"
            name="first_name"
            required={false}
            rules={[{ required: true, message: 'Ingrese su nombre' }]}
          >
            <Input placeholder="Nombre" size="large" autoFocus />
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="last_name"
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
          name="phone_number"
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
          name="date_of_birth"
          required={false}
          rules={[
            { required: true, message: 'Ingrese su fecha de nacimiento' },
            { validator: dateValidator },
          ]}
        >
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Género"
          name="gender"
          required={false}
          rules={[{ required: true, message: 'Seleccione una opción' }]}
        >
          <Select placeholder="Selecciona tu género" size="large">
            <Select.Option value="MALE">Masculino</Select.Option>
            <Select.Option value="FEMALE">Femenino</Select.Option>
            <Select.Option value="OTHER">Otro</Select.Option>
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
        ¿Ya tenés una cuenta?
        <Button type="link" size="small" disabled={isLoading}>
          <Link to="/auth/login">Iniciar sesión</Link>
        </Button>
      </Typography>
    </Spin>
  )
}

function SuccessMesage({ email }: { email: string }) {
  return (
    <>
      <Typography.Paragraph>
        Se envió un correo a <Typography.Text strong>{email}</Typography.Text>{' '}
        con un código de verificación.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        <Typography.Text type="secondary" strong>
          Nota:
        </Typography.Text>{' '}
        Al hacer click en{' '}
        <Typography.Text type="secondary" italic>
          "ok"
        </Typography.Text>{' '}
        será ridirigido a la pagína de inicio de sesión
      </Typography.Paragraph>
    </>
  )
}
