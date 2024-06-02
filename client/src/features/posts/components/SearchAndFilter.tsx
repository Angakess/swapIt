import { SearchOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, Select, SelectProps, theme } from 'antd'

type FilterType = {
  initialValue: string
  options: SelectProps['options']
}

export type SearchAndFilterProps = {
  searchPlaceholder: string
  filters: Record<string, FilterType>
  disabled: boolean
  onSearch: (values: Record<string, string>) => void
}

export function SearchAndFilter({
  searchPlaceholder,
  filters,
  onSearch,
  disabled,
}: SearchAndFilterProps) {
  const { colorBgBase, borderRadius } = theme.useToken().token

  const [form] = Form.useForm()

  return (
    <Form
      form={form}
      disabled={disabled}
      onFinish={onSearch}
      layout="vertical"
      initialValues={Object.keys(filters).reduce(
        (acc, filter) => ({
          ...acc,
          [filter]: filters[filter].initialValue,
        }),
        { search: '' }
      )}
    >
      <Form.Item name="search" style={{ marginBottom: '1rem' }}>
        <Input
          style={{ backgroundColor: colorBgBase }}
          size="large"
          variant="borderless"
          placeholder={searchPlaceholder}
        />
      </Form.Item>

      <div style={{ overflowX: 'auto' }}>
        <Flex gap="1rem">
          {Object.keys(filters).map((filter) => (
            <Form.Item
              name={filter}
              key={filter}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              <Select
                options={filters[filter].options}
                style={{
                  width: '100%',
                  backgroundColor: colorBgBase,
                  borderRadius,
                  textTransform: 'capitalize',
                }}
                dropdownStyle={{ textTransform: 'capitalize' }}
                size="small"
                variant="borderless"
              />
            </Form.Item>
          ))}
        </Flex>
      </div>

      <Form.Item>
        <Flex justify="end">
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            Buscar
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  )
}
