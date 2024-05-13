import { Button, Flex, Form } from 'antd'
import { Link } from 'react-router-dom'

export function ForgotPasswordItem({ disabled }: { disabled: boolean }) {
  return (
    <Form.Item>
      <Flex align="end" vertical>
        <Button type="link" size="small" disabled={disabled}>
          <Link to="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
        </Button>
      </Flex>
    </Form.Item>
  )
}
