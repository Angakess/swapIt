import { Select, SelectProps, theme } from 'antd'

type Props = {
  options: SelectProps['options']
  placeholder: string
  defaultValue: string | null
}

export function SelectFilter({ options, placeholder, defaultValue }: Props) {
  const { colorBgBase, borderRadius } = theme.useToken().token

  return (
    <Select
      style={{ width: '100%', backgroundColor: colorBgBase, borderRadius }}
      size="small"
      variant="borderless"
      placeholder={placeholder}
      options={options}
      defaultValue={defaultValue}
    />
  )
}
