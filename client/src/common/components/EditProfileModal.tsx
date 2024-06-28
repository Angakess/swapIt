import { UserDetailsModel, UserGender, getUserDetails } from '@Common/api'
import { dateValidator, phoneValidator } from '@Common/helpers/validators'
import { useAuth } from '@Common/hooks'
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Spin,
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { SetStateAction, useEffect, useState } from 'react'

type EditProfileModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

type EditFormData = {
  email: string
  phone_number: string
  date_of_birth: Dayjs
  gender: UserGender
  password: string
  confirmPassword: string
  currentPassword: string
}

export function EditProfileModal({ isOpen, setIsOpen }: EditProfileModalProps) {
  const { user } = useAuth()

  const [userDetails, setUserDetails] = useState<UserDetailsModel>()
  const [isLoading, setIsLoading] = useState(true)

  const [form] = Form.useForm<EditFormData>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const u = await getUserDetails(user!.id)

      if (u === null) throw new Error('User not found')

      form.setFieldsValue({
        email: u.email,
        phone_number: u.phone_number,
        date_of_birth: dayjs(u.date_of_birth),
        gender: u.gender,
      })

      setUserDetails(u)
      setIsLoading(false)
    })()
  }, [form, user])

  function handleFinish() {
    console.log('first')
  }

  return (
    <Modal
      title="Editar perfil"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <>
          <Form
            layout="vertical"
            onFinish={handleFinish}
            disabled={isLoading}
            form={form}
          >
            <Flex gap="1rem">
              <Form.Item label="Nombre">
                <Input size="large" disabled value={userDetails!.first_name} />
              </Form.Item>

              <Form.Item label="Apellido">
                <Input size="large" disabled value={userDetails!.last_name} />
              </Form.Item>
            </Flex>

            <Form.Item label="DNI">
              <Input size="large" disabled value={userDetails!.dni} />
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

            <Form.Item label="Contraseña" name="password">
              <Input.Password placeholder="Contraseña" size="large" />
            </Form.Item>

            <Form.Item
              label="Confirmar contraseña"
              name="confirmPassword"
              dependencies={['password']}
              required={false}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('Las contraseñas no coinciden')
                    )
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirmar contraseña" size="large" />
            </Form.Item>

            <Divider />

            <Form.Item
              label="Contraseña actual"
              name="currentPassword"
              required={false}
              rules={[{ required: true, message: 'Ingrese su contraseña' }]}
              extra="Debes ingresar tu contraseña actual para poder realizar los cambios"
            >
              <Input.Password placeholder="Contraseña actual" size="large" />
            </Form.Item>

            <Flex
              justify="space-between"
              align="center"
              style={{ paddingTop: '1rem' }}
            >
              <Button danger>Eliminar cuenta</Button>
              <Button type="primary" htmlType="submit">
                Editar perfil
              </Button>
            </Flex>
          </Form>
        </>
      )}
    </Modal>
  )
}
