import { useState } from 'react'
import { Dayjs } from 'dayjs'
import { Link, useNavigate } from 'react-router-dom'
import {
  App,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  FormProps,
  Spin,
} from 'antd'
import { AuthTitle } from '@Auth/components'
import { dateValidator, phoneValidator } from '@Common/helpers/validators'
import { fetchPost } from 'common/helpers'
import { UserRole } from '@Common/types'
import {
  ConfirmPasswordItem,
  DniItem,
  SubmitItem,
} from '@Auth/components/items'
import { UserGender } from '@Common/api'

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

        <DniItem />

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
          <Input placeholder="2211234567" size="large" />
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

        <ConfirmPasswordItem />

        <SubmitItem text="Crear cuenta" style={{ marginTop: '0.5rem' }} />
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
        será redirigido a la página de inicio de sesión
      </Typography.Paragraph>
    </>
  )
}
