import {
  Button,
  Space,
  Table,
  Input,
  TableColumnType,
  InputRef,
  Modal,
  Tooltip,
} from 'antd'
import { GetProp, TableProps } from 'antd'
import {
  SearchOutlined,
  ShopFilled,
  UserDeleteOutlined,
} from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import { Link } from 'react-router-dom'
import { PageTitle } from '@Common/components'

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
      cant_current_helpers: number
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
  const [loadingFetch, setLoadingFetch] = useState(false)
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
    id: '',
    full_name: 'nombre',
    dni: 'DNI',
    subsidiary_name: 'filial',
    subsidiary_cant_helpers: '',
  }

  const fetchData = async () => {
    setLoadingFetch(true)
    const res = await fetch('http://localhost:8000/users/list-helpers/')
    const result = await res.json()
    const transformedData = result.map((item: fetchType) => ({
      id: item.id,
      full_name: item.full_name,
      dni: item.dni,
      subsidiary_name: item.subsidiary.name,
      subsidiary_cant_helpers: item.subsidiary.cant_current_helpers,
    }))
    setData(transformedData)
    setLoadingFetch(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: result.filter(
          (item: any) =>
            item.full_name.includes(searchText.full_name) &&
            item.dni.includes(searchText.dni) &&
            item.subsidiary.name.includes(searchText.subsidiary_name)
        ),
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
          <Link to={`/admin/helpers/change-local/${record.id}`}>
            <Tooltip title="Cambiar filial">
              <Button
                type="primary"
                icon={<ShopFilled />}
                disabled={loading}
              ></Button>
            </Tooltip>
          </Link>
          <Tooltip title="Desincorporar ayudante">
            <Button
              type="primary"
              danger
              icon={<UserDeleteOutlined />}
              onClick={() => showModal(record)}
              disabled={loading}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [helperSelected, setHelperSelected] = useState<DataType>()

  const showModal = (record: DataType) => {
    setIsModalOpen(true)
    setHelperSelected(record)
  }
  const handleOk = async () => {
    setLoading(true)
    const res = await fetch(
      `http://localhost:8000/users/disincorporate-helper/${helperSelected?.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }
    )
    const result = await res.json()
    if (res.ok) {
      Modal.success({
        title: 'Operación completada',
        content: result.messages,
      })
    } else {
      Modal.error({
        title: 'Operación fallida',
        content: result.messages,
      })
    }
    setIsModalOpen(false)
    fetchData()
    setLoading(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <PageTitle title="Ayudantes" />
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loadingFetch}
        onChange={handleTableChange}
        locale={{ emptyText: 'No hay ayudantes disponibles' }}
      />
      <Modal
        title="Atención"
        open={isModalOpen || loading}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Desincorporar"
        okButtonProps={{ danger: true, disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <p>¿Está seguro que quiere desincorporar a este ayudante?</p>

        {helperSelected?.subsidiary_cant_helpers === 1 ? (
          <p style={{ fontWeight: 'bold' }}>
            IMPORTANTE: Si {helperSelected.full_name} es desincorporado/a, la
            filial '{helperSelected.subsidiary_name}' se quedará sin ayudantes,
            lo que deshabilitará la sucursal y suspenderá todas las
            publicaciones relacionadas
          </p>
        ) : null}

        {loading && (
          <p style={{ fontWeight: 'normal', color: '#FF4D4F' }}>
            {' '}
            Esta operación puede tardar unos minutos
          </p>
        )}
      </Modal>
    </>
  )
}
