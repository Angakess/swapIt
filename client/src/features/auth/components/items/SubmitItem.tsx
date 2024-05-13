import { Button, ButtonProps, Form } from 'antd'

type SubmitItemProps = {
  text: string
} & ButtonProps

export function SubmitItem({ text, ...props }: SubmitItemProps) {
  return (
    <Form.Item>
      <Button block type="primary" size="large" htmlType="submit" {...props}>
        {text}
      </Button>
    </Form.Item>
  )
}
