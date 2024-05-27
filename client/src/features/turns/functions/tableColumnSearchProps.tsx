import { Button, Input, InputRef, Space, TableColumnType } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { FilterConfirmProps, FilterDropdownProps } from 'antd/es/table/interface'

type DataIndex = keyof DataType
interface DataType {
  id: number
  date: string
  subsidiary: string
  confirmed: boolean
  [key: string]: string | number | boolean
}

export function tableColumnSearchProps(
  dataIndex: DataIndex,
  handleSearch: (selectedKeys: string[], confirm: (param?: FilterConfirmProps | undefined) => void, dataIndex: keyof DataType) => void,
  handleReset: (clearFilters: () => void, confirm: (param?: FilterConfirmProps | undefined) => void, dataIndex: keyof DataType) => void,
  searchInput: React.RefObject<InputRef>
): TableColumnType<DataType> {
  function handleFilterDropdown({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }: FilterDropdownProps) {
    return (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{ width: 90 }}
          >
            Resetear
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    )
  }

  return {
    filterDropdown: handleFilterDropdown,
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  }
}
