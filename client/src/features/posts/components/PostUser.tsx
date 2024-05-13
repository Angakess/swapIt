import { UserAvatar } from '@Common/components/UserAvatar'
import { StarFilled } from '@ant-design/icons'
import { Flex, Space, Typography, theme } from 'antd'

export function PostUser() {
  const { colorPrimary } = theme.useToken().token

  return (
    <Flex justify="space-between">
      <UserAvatar firstName="John" lastName="Doe" size="large" />
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
