import { Typography, theme } from 'antd'

export function AuthTitle({ children }: React.PropsWithChildren) {
  const { token } = theme.useToken()

  return (
    <Typography.Title
      level={2}
      style={{ textAlign: 'center', color: token.colorPrimaryActive }}
    >
      {children}
    </Typography.Title>
  )
}
