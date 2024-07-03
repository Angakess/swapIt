import { dateValidator, phoneValidator } from '@Common/helpers/validators'
import { useAuth, useEditProfileForm } from '@Common/hooks'
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
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { DangerPopConfirm } from './DangerPopConfirm'

type EditProfileModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditProfileModal({ isOpen, setIsOpen }: EditProfileModalProps) {
  const { user } = useAuth()

  const {
    userDetails,
    isLoading,
    isUpdating,
    form,
    hasBeenUpdated,
    setInitialValues,
    isFormUpdated,
    handleFinish,
    handleDeleteAccount,
    invalidPasswordValidation,
    setInvalidPasswordValidation,
  } = useEditProfileForm()

  useEffect(() => {
    form.validateFields(['currentPassword'])
  }, [form, invalidPasswordValidation])

  return (
    <Modal
      title="Editar perfil"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      forceRender
      footer={null}
    >
      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <>
          <Form
            layout="vertical"
            onFinish={handleFinish}
            disabled={isLoading || isUpdating}
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
              rules={[
                { required: true, message: 'Ingrese su contraseña' },
                () => ({
                  validator() {
                    if (!invalidPasswordValidation) {
                      return Promise.resolve()
                    }
                    return Promise.reject('Contraseña incorrecta')
                  },
                }),
              ]}
              extra="Debes ingresar tu contraseña actual para poder realizar los cambios"
            >
              <Input.Password
                placeholder="Contraseña actual"
                size="large"
                onChange={() => setInvalidPasswordValidation(false)}
              />
            </Form.Item>

            <Flex
              justify={
                user!.role === 'EXCHANGER' ? 'space-between' : 'flex-end'
              }
              align="center"
              style={{ paddingTop: '1rem' }}
            >
              {user!.role === 'EXCHANGER' && (
                <DangerPopConfirm
                  title="Eliminar cuenta"
                  description={
                    <>
                      <Typography.Paragraph style={{ marginBottom: '0.25rem' }}>
                        ¿Está seguro que desea eliminar su cuenta?
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        Esta acción no se puede revertir.
                      </Typography.Paragraph>
                    </>
                  }
                  okText="Sí, eliminar cuenta"
                  cancelText="No, cancelar"
                  placement="top"
                  onConfirm={handleDeleteAccount}
                >
                  <Button danger loading={isUpdating}>
                    Eliminar cuenta
                  </Button>
                </DangerPopConfirm>
              )}

              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!hasBeenUpdated}
                  loading={isUpdating}
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
