import { Input, theme } from 'antd'

export type SearchBarProps = {
  placeholder: string
}

export function SearchBar({ placeholder }: SearchBarProps) {
  const { colorBgBase } = theme.useToken().token

  return (
    <Input
      style={{ backgroundColor: colorBgBase, marginBottom: '1rem' }}
      size="large"
      variant="borderless"
      placeholder={placeholder}
    />
  )
}
