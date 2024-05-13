import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Form, Input } from 'antd'

export function SinglePasswordItem() {
  return (
    <Form.Item
      label="Contraseña"
      name="password"
      required={false}
      rules={[{ required: true, message: 'Porfavor ingrese su contraseña' }]}
      style={{ marginBottom: '0.25rem' }}
    >
      <Input.Password
        placeholder="Ingrese su contraseña"
        size="large"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Form.Item>
  )
}
