import { Form, InputNumber } from 'antd'
import { dniValidator } from '@Common/helpers/validators'

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
        { required: true, message: 'Porfavor ingrese su DNI' },
        { validator: dniValidator },
      ]}
    >
      <InputNumber
        placeholder="Ingrese su DNI"
        size="large"
        style={{ width: '100%' }}
        controls={false}
        autoFocus={autoFocus}
      />
    </Form.Item>
  )
}
