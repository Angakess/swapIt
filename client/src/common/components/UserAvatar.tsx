import { Avatar, Flex, Typography } from 'antd'
import { AvatarProps } from 'antd/es/skeleton/Avatar'

type UserAvatarProps = {
  firstName: string
  lastName: string
  score?: number
  order?: 'avatarFirst' | 'nameFirst'
} & AvatarProps

export function UserAvatar({
  firstName,
  lastName,
  score,
  order = 'avatarFirst',
  ...props
}: UserAvatarProps) {
  return (
    <Flex
      align="center"
      gap="small"
      style={{
        flexDirection: order === 'avatarFirst' ? 'row' : 'row-reverse',
      }}
    >
      <Avatar style={{ backgroundColor: '#D02F4C' }} {...props}>
        {(firstName[0] + lastName[0]).toUpperCase()}
      </Avatar>
      <Typography.Text>
        {firstName} {lastName}{' '}
        {score && (
          <Typography.Text type="secondary" italic>
            ({score} puntos)
          </Typography.Text>
        )}
      </Typography.Text>
    </Flex>
  )
}
