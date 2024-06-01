import {
    Button,
    DatePicker,
    Input,
    InputRef,
    Space,
    TableColumnType,
  } from 'antd'
  import { SearchOutlined } from '@ant-design/icons'
  import {
    FilterConfirmProps,
    FilterDropdownProps,
  } from 'antd/es/table/interface'
  import dayjs from 'dayjs'
  import customParseFormat from 'dayjs/plugin/customParseFormat'
  
  type RequestIndex = keyof RequestType
  interface RequestType {
    id: number
    myPostName: string
    myPostId: number
    myPostImage: string
    otherPostName: string
    otherPostId: number
    otherPostImage: string
    state: string
    [key: string]: string | number | boolean
  }
  
  dayjs.extend(customParseFormat)
  
  export function tableColumnSearchProps(
    dataIndex: RequestIndex,
    handleSearch: (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps | undefined) => void,
      dataIndex: keyof RequestType
    ) => void,
    handleReset: (
      clearFilters: () => void,
      confirm: (param?: FilterConfirmProps | undefined) => void,
      dataIndex: keyof RequestType
    ) => void,
    searchInput: React.RefObject<InputRef>
  ): TableColumnType<RequestType> {
    function handleFilterDropdown({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: FilterDropdownProps) {
      const dateValue =
        selectedKeys[0] && typeof selectedKeys[0] === 'string'
          ? dayjs(selectedKeys[0], 'DD/MM/YYYY')
          : null
  
      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          {dataIndex === 'date' ? (
            <DatePicker
              format={'DD-MM-YYYY'}
              placeholder="Seleccione una fecha"
              value={dateValue}
              onChange={(date) => {
                setSelectedKeys(date ? [date.format('DD/MM/YYYY')] : [])
              }}
              allowClear={true}
              style={{ marginBottom: 8, display: 'block' }}
            />
          ) : (
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
          )}
  
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
  