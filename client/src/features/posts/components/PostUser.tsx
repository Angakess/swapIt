import { UserAvatar } from '@Common/components/UserAvatar'
import { StarFilled } from '@ant-design/icons'
import { Flex, Space, Typography, theme } from 'antd'

type PostUserProps = {
  firstName: string
  lastName: string
}

export function PostUser({ firstName, lastName }: PostUserProps) {
  const { colorPrimary } = theme.useToken().token

  return (
    <Flex justify="space-between">
      <UserAvatar firstName={firstName} lastName={lastName} size="large" />
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
