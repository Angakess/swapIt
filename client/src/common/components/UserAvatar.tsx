import { Avatar, Flex, Typography } from 'antd'
import { AvatarProps } from 'antd/es/skeleton/Avatar'

type UserAvatarProps = {
  firstName: string
  lastName: string
  order?: 'avatarFirst' | 'nameFirst'
} & AvatarProps

export function UserAvatar({
  firstName,
  lastName,
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
        {firstName} {lastName}
      </Typography.Text>
    </Flex>
  )
}
