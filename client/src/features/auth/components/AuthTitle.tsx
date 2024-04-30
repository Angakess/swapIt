import { Typography, theme } from 'antd'

export function AuthTitle({ children }: React.PropsWithChildren) {
  const { token } = theme.useToken()

  return (
    <Typography.Title
      level={3}
      style={{
        textAlign: 'center',
        color: token.colorPrimaryActive,
        marginBottom: '2rem',
      }}
    >
      {children}
    </Typography.Title>
  )
}
