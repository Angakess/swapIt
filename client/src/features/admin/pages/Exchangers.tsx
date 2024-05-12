import {
  Button,
  Space,
  Table,
  Input,
  TableColumnType,
  InputRef,
} from 'antd'
import { GetProp, TableProps } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import type { FilterDropdownProps } from 'antd/es/table/interface'

export function Exchangers() {
  type ColumnsType<T> = TableProps<T>['columns']
  type TablePaginationConfig = Exclude<
    GetProp<TableProps, 'pagination'>,
    boolean
  >
  type DataIndex = keyof DataType

  interface DataType {
    id: number
    full_name: string
    dni: string
    email: string
    user_state: string
  }

  interface TableParams {
    pagination?: TablePaginationConfig
    sortField?: string
    sortOrder?: string
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
  }

  /* const getRandomUserParams = (params: TableParams) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    }) */

  const [data, setData] = useState<DataType[]>([{
    id: 0,
    full_name: "",
    dni: "",
    email: "",
    user_state: ""
  }])
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

  const fetchData = async() => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/users/list-exchangers/")
    const result = await res.json()
    setData(result)
    setLoading(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: result.filter((item: DataType) =>
          item.full_name.includes(searchText.full_name) &&
          item.dni.includes(searchText.dni) &&
          item.email.includes(searchText.email))
      },
    })
  }

  useEffect(() => {
    fetchData()
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize])

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

  const [searchText, setSearchText] = useState<DataType>({
    id: 0,
    full_name: '',
    dni: '',
    email: '',
    user_state: ""
  })
  //const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm(),
      setSearchText((prevText) => {
        return {
          ...prevText,
          [dataIndex]: selectedKeys[0],
        }
      })
    //setSearchedColumn(dataIndex)
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    clearFilters()
    setSearchText((searchText) => {
      return {
        ...searchText,
        [dataIndex]: '',
      }
    })
    confirm()
    //setSearchedColumn(dataIndex)
  }

  const goToProfile = (record:DataType) => {
    window.location.assign(`/admin/exchangers/${record.id}`)
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
      title: `Nombre: ${searchText.full_name}`,
      dataIndex: 'full_name',
      render: (full_name) => `${full_name}`,
      width: '25%',
      ...getColumnSearchProps('full_name'),
    },
    {
      title: `DNI: ${searchText.dni}`,
      dataIndex: 'dni',
      width: '20%',
      ...getColumnSearchProps('dni'),
    },
    {
      title: `Email: ${searchText.email}`,
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: `Estado: ${searchText.user_state}`,
      dataIndex: 'user_state',
      filters: [
        { text: 'Activo', value: 'Activo' },
        { text: 'Inactivo', value: 'Inactivo' },
        { text: 'Bloqueado', value: 'Bloqueado' },
        { text: 'Eliminado', value: 'Eliminado' },
      ],
      onFilter: (value, record) => record.user_state === value,
      filterSearch: false,
      width: "10%"
    },
    {
      title: 'Acciones',
      render: (_: any, record: DataType) => (
        <Space>
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={() => goToProfile(record)}
          >
            Ver perfil
          </Button>
        </Space>
      ),
      width: "0"
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{emptyText: "No hay intercambiadores disponibles"}}
      />
    </>
  )
}
