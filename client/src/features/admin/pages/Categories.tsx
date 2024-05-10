import { Button, GetProp, Input, InputRef, Space, Table, TableColumnType, TableProps } from "antd"
import { FilterDropdownProps } from "antd/es/table/interface"
import { SearchOutlined, UserOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from "react"
/* import MOCK_DATA from "./MOCK_DATA_CAT.json" */

type DataIndex = keyof DataType
interface DataType {
  id: number,
  name: string,
  active: boolean
}

type ColumnsType<T> = TableProps<T>['columns']
  type TablePaginationConfig = Exclude<
    GetProp<TableProps, 'pagination'>,
    boolean
  >
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function Categories() {
  
  const [data, setData] = useState<DataType[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [searchCatName, setSearchCatName] = useState("")
  const searchInput = useRef<InputRef>(null)

  const fetchData = () => {
    setIsLoading(true)
    //------Version mock---------------------------------------------------------------
    /* setData(MOCK_DATA)
    setIsLoading(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: MOCK_DATA.length,
      },
    }) */

    fetch("http://localhost:8000/category/list/")
      .then(res => res.json())
      .then((results) => {
        setData(results)
        console.log(results)
        setIsLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
              ...tableParams.pagination,
              total: results.filter((item: DataType) => item.name.includes(searchCatName)).length
            },
          }
        )
      }
    )
  }

  useEffect(() => {
    fetchData()
  },[tableParams.pagination?.current, tableParams.pagination?.pageSize, searchCatName])

  const handleTableChange: TableProps['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    })
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([])
    }
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
  ) => {
    confirm(),
      setSearchCatName(selectedKeys[0])
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
  ) => {
    clearFilters()
    setSearchCatName("")
    confirm()
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm)
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
    ),
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
  })

  const columns: ColumnsType<DataType> = [
    {
      title: `Nombre: ${searchCatName}`,
      dataIndex: 'name',
      render: (name) => `${name}`,
      width: '60%',
      ...getColumnSearchProps('name'),
    },
    {
      title: `Estado:`,
      dataIndex: 'active',
      render: (isActive) => isActive ? "Activo" : "Pausado",
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      onFilter: (value, record) => record.active === value,
      filterSearch: false,
    },
    {
      title: 'Acciones',
      render: (_: any, __: DataType, index: number) => (
        <Space>
          {data && data[index].active ? <Button
            type="primary"
            icon={<PauseOutlined />}
          >
          </Button> : 
          <Button
            type="primary"
            icon={<CaretRightOutlined />}
          >
          </Button>}
          <Button
            type="primary"
            icon={<UserOutlined />}
          >
          </Button>
        </Space>
      ),
      width: '100px',
    },
  ]
  





  
  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        locale={{emptyText: "No hay categorías disponibles"}}
      />
    </>
  )
}
