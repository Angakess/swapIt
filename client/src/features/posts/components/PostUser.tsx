import { StarFilled } from '@ant-design/icons'
import { Avatar, Flex, Space, Typography, theme } from 'antd'

export function PostUser() {
  const { colorPrimary } = theme.useToken().token

  return (
    <Flex justify="space-between">
      <Space>
        <Avatar size="large">JD</Avatar>
        <Typography.Text strong>John Doe</Typography.Text>
      </Space>
      <Space>
        <StarFilled style={{ color: colorPrimary, fontSize: '1rem' }} />
        <Typography.Text>
          4.7{' '}
          <Typography.Text italic type="secondary">
            (15)
          </Typography.Text>
        </Typography.Text>
      </Space>
    </Flex>
  )
}
