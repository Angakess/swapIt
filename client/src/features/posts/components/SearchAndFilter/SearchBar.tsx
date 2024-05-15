import { Input, theme } from 'antd'

export type SearchBarProps = {
  placeholder: string
  value: string
  handleChange: React.ChangeEventHandler<HTMLInputElement>
}

export function SearchBar({
  placeholder,
  value,
  handleChange,
}: SearchBarProps) {
  const { colorBgBase } = theme.useToken().token

  return (
    <Input
      style={{ backgroundColor: colorBgBase, marginBottom: '1rem' }}
      size="large"
      variant="borderless"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  )
}
