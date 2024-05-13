import {
  Button,
  Space,
  Table,
  Input,
  TableColumnType,
  InputRef,
  Modal,
} from 'antd'
import { GetProp, TableProps } from 'antd'
import {
  SearchOutlined,
  ShopFilled,
  UserDeleteOutlined,
} from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import type { FilterDropdownProps } from 'antd/es/table/interface'

export function Helpers() {
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
    subsidiary_name: string
    subsidiary_cant_helpers: number
  }
  interface fetchType {
    id: number
    full_name: string
    dni: string
    subsidiary: {
      name: string
      cant_helpers: number
    }
  }

  interface TableParams {
    pagination?: TablePaginationConfig
    sortField?: string
    sortOrder?: string
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
  }

  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [searchText, setSearchText] = useState({
    full_name: '',
    dni: '',
    subsidiary_name: '',
  })
  const columnNames = {
    id: "",
    full_name: "nombre",
    dni: "DNI",
    subsidiary_name: "filial",
    subsidiary_cant_helpers: ""
  }

  const fetchData = async() => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/users/list-helpers/")
    const result = await res.json()
    const transformedData = result.map((item: fetchType) => ({
      id:item.id,
      full_name: item.full_name,
      dni: item.dni,
      subsidiary_name: item.subsidiary.name,
      subsidiary_cant_helpers: item.subsidiary.cant_helpers
    }))
    setData(transformedData)
    setLoading(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: result.filter((item:any) =>
          item.full_name.includes(searchText.full_name) &&
          item.dni.includes(searchText.dni) &&
          item.subsidiary.name.includes(searchText.subsidiary_name))
      },
    })
  }

  useEffect(() => {
    fetchData()
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    searchText,
  ])

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
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex | string
  ) => {
    clearFilters()
    setSearchText((searchText) => {
      return {
        ...searchText,
        [dataIndex]: '',
      }
    })
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
          placeholder={`Buscar ${columnNames[dataIndex]}`}
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
      width: '15%',
      ...getColumnSearchProps('dni'),
    },
    {
      title: `Filial: ${searchText.subsidiary_name}`,
      dataIndex: 'subsidiary_name',
      ...getColumnSearchProps('subsidiary_name'),
      sorter: (a, b) => a.subsidiary_name.localeCompare(b.subsidiary_name),
      width: '50%',
    },
    {
      title: 'Acciones',
      render: (_: any, record: DataType) => (
        <Space>
          <Button
            type="primary"
            icon={<ShopFilled />}
            onClick={() => goToLocalChange(record.id)}
          ></Button>
          <Button
            type="primary"
            danger
            icon={<UserDeleteOutlined />}
            onClick={() => showModal(record.id - 1)}
          ></Button>
        </Space>
      ),
    },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idSelected, setIdSelected] = useState(0)

  const goToLocalChange = (id: number) => {
    window.location.assign(`/admin/helpers/change-local/${id}`)
  }

  const showModal = (newId: number) => {
    setIsModalOpen(true)
    setIdSelected(newId)
  }
  const handleOk = () => {
    setIsModalOpen(false)
    if (data !== undefined)
      console.log(`AYUDANTE ${data[idSelected].full_name} DESINCORPORADO`)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    console.log('OPERACION CANCELADA')
  }

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{ emptyText: 'No hay ayudantes disponibles' }}
      />
      <Modal
        title="Atención"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Desincorporar"
        okButtonProps={{ danger: true }}
      >
        <p>¿Está seguro que quiere desincorporar a este ayudante?</p>
      </Modal>
    </>
  )
}
