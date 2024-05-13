import { Form, Input } from 'antd'

type InputDniProps = {
  autoFocus?: boolean
}

export function DniItem({ autoFocus = false }: InputDniProps) {
  return (
    <Form.Item
      label="DNI"
      name="dni"
      required={false}
      rules={[
        { required: true, message: 'Ingrese su DNI' },
        { len: 8, message: 'El DNI debe ser de 8 dígitos' },
        { pattern: /^\d+$/, message: 'El DNI debe ser un número' },
      ]}
    >
      <Input
        placeholder="Ingrese su DNI"
        size="large"
        style={{ width: '100%' }}
        autoFocus={autoFocus}
      />
    </Form.Item>
  )
}
