import { Input, theme } from 'antd'

export function SearchBar() {
  const { colorBgBase } = theme.useToken().token

  return (
    <Input
      style={{ backgroundColor: colorBgBase, marginBottom: '1rem' }}
      size="large"
      variant="borderless"
      placeholder="Busca un producto"
    />
  )
}
