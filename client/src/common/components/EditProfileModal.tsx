import { dateValidator, phoneValidator } from '@Common/helpers/validators'
import { useEditProfileForm } from '@Common/hooks'
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
import { SetStateAction } from 'react'
import { DangerPopConfirm } from './DangerPopConfirm'

type EditProfileModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

export function EditProfileModal({ isOpen, setIsOpen }: EditProfileModalProps) {
  const {
    userDetails,
    isLoading,
    form,
    hasBeenUpdated,
    setInitialValues,
    isFormUpdated,
    handleFinish,
    handleDeleteAccount,
  } = useEditProfileForm()

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
            onValuesChange={(_, values) => isFormUpdated(values)}
            onReset={setInitialValues}
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
              <DangerPopConfirm
                title="Eliminar cuenta"
                description="¿Está seguro que desea eliminar su cuenta? Esta acción no se puede revertir"
                okText="Sí, eliminar cuenta"
                cancelText="No, cancelar"
                placement="topLeft"
                onConfirm={handleDeleteAccount}
              >
                <Button danger>Eliminar cuenta</Button>
              </DangerPopConfirm>

              <div>
                <Button
                  type="text"
                  htmlType="reset"
                  style={{ marginRight: '1rem' }}
                  disabled={!hasBeenUpdated}
                >
                  Restablecer
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!hasBeenUpdated}
                >
                  Editar perfil
                </Button>
              </div>
            </Flex>
          </Form>
        </>
      )}
    </Modal>
  )
}
