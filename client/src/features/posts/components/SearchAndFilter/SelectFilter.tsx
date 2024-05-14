import { Select, SelectProps, theme } from 'antd'

export type SelectFilterProps = {
  options: SelectProps['options']
  placeholder: string
  defaultValue: string
}

export function SelectFilter({
  options,
  placeholder,
  defaultValue,
}: SelectFilterProps) {
  const { colorBgBase, borderRadius } = theme.useToken().token

  return (
    <Select
      key={placeholder}
      style={{
        width: '100%',
        backgroundColor: colorBgBase,
        borderRadius,
        textTransform: 'capitalize',
      }}
      dropdownStyle={{ textTransform: 'capitalize' }}
      size="small"
      variant="borderless"
      placeholder={placeholder}
      options={options}
      defaultValue={defaultValue}
    />
  )
}
