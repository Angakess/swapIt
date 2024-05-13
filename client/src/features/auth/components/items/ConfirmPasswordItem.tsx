import { Form, Input } from 'antd'

export function ConfirmPasswordItem() {
  return (
    <>
      <Form.Item
        label="Contraseña"
        name="password"
        required={false}
        rules={[{ required: true, message: 'Ingrese su contraseña' }]}
      >
        <Input.Password placeholder="Contraseña" size="large" />
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
                new Error('No coincide con la contraseña ingresada previamente')
              )
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirmar contraseña" size="large" />
      </Form.Item>
    </>
  )
}
