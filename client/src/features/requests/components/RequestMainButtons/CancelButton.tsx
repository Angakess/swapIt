import { CloseOutlined } from '@ant-design/icons'
import { Button, ButtonProps } from 'antd'

export function CancelButton({
  disabled,
  cancelProps,
}: {
  disabled: boolean
  cancelProps?: ButtonProps
}) {
  return (
    <Button
      {...cancelProps}
      type="primary"
      block
      danger
      disabled={disabled}
      icon={<CloseOutlined />}
    >
      Cancelar
    </Button>
  )
}
