import { Popconfirm, PopconfirmProps, theme } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export function DangerPopConfirm({ children, ...popProps }: PopconfirmProps) {
  const { colorError } = theme.useToken().token

  return (
    <Popconfirm
      {...popProps}
      okType="danger"
      icon={<ExclamationCircleOutlined style={{ color: colorError }} />}
    >
      {children}
    </Popconfirm>
  )
}
