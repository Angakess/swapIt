import { Flex, Typography } from 'antd'

type PageTitleProps = {
  title: string
  right?: React.ReactNode
}

export function PageTitle({ title, right }: PageTitleProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{ marginBottom: '1rem' }}
    >
      <Typography.Title level={2}>{title}</Typography.Title>
      {right}
    </Flex>
  )
}
