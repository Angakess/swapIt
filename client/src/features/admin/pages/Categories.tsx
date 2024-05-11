import {
  Button,
  GetProp,
  Input,
  InputRef,
  Modal,
  Space,
  Table,
  TableColumnType,
  TableProps,
} from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import {
  SearchOutlined,
  EditOutlined,
  PauseOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
/* import MOCK_DATA from "./MOCK_DATA_CAT.json" */

type DataIndex = keyof DataType
interface DataType {
  id: number
  name: string
  active: boolean
}

type ColumnsType<T> = TableProps<T>['columns']
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function Categories() {
  const [data, setData] = useState<DataType[]>([
    {
      id: 0,
      name: '',
      active: false,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [searchCatName, setSearchCatName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idSelected, setIdSelected] = useState(0)
  const [newName, setNewName] = useState('')
  const [inputStatus, setInputStatus] = useState<'' | 'error'>('')
  const [inputErrorMessage, setInputErrorMessage] = useState('')

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

    fetch('http://localhost:8000/category/list/')
      .then((res) => res.json())
      .then((results) => {
        setData(results)
        console.log(results)
        setIsLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.filter((item: DataType) =>
              item.name.includes(searchCatName)
            ).length,
          },
        })
      })
  }
  const sendNewCat = () => {
    try {
      fetch("http://localhost:8000/category",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName
        })
      })
      .then((res) => res.json)
      .then((result) => {console.log("resultado de sendNewCat: ",result)})
    }
    catch (error){
      alert(error)
    }
    
    
    
    
    /* fetch("http://localhost:8000/category",{
      method: "POST",
      body: JSON.stringify({
        name: newName
      })
    })
    .then((res) => res.json) */
  }

  useEffect(() => {
    fetchData()
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    searchCatName,
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

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm']
  ) => {
    confirm(), setSearchCatName(selectedKeys[0])
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm']
  ) => {
    clearFilters()
    setSearchCatName('')
    confirm()
  }

  const handleClickPause = (index: number) => {
    console.log(`SE PAUSO LA CATEGORIA ${data[index].name}`)
  }
  const handleClickResume = (index: number) => {
    console.log(`SE REANUDO LA CATEGORIA ${data[index].name}`)
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
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
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
      render: (isActive) => (isActive ? 'Activo' : 'Pausado'),
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
          {data && data[index].active ? (
            <Button type="default" icon={<PauseOutlined />} onClick={() => handleClickPause(index)}></Button>
          ) : (
            <Button type="default" icon={<CaretRightOutlined />} onClick={() => handleClickResume(index)}></Button>
          )}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModalEdit(index)}
          ></Button>
        </Space>
      ),
      width: '100px',
    },
  ]

  const showModalEdit = (index: number) => {
    setIsModalOpen(true)
    setIdSelected(index)
  }
  const handleOk = () => {
    if (!newName) {
      setInputStatus('error')
      setInputErrorMessage('El nombre es obligatorio')
      return
    }
    if (data.some((item) => item.name === newName)) {
      setInputStatus('error')
      setInputErrorMessage(
        `Ya existe una categoría con el nombre "${newName}"`
      )
      return
    }
    setIsModalOpen(false)
    console.log(`CATEGORIA ${data[idSelected].name} EDITADA A ${newName}`)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    console.log('OPERACION CANCELADA')
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value)
    setInputStatus('')
    setInputErrorMessage('')
    console.log(event.target.value)
  }

  const [isModalOpenNewCat, setIsModalOpenNewCat] = useState(false)

  const showModalNewCat = () => {
    setIsModalOpenNewCat(true)
  }
  const handleOkNewCat = () => {
    if (!newName) {
      setInputStatus('error')
      setInputErrorMessage('El nombre es obligatorio')
      return
    }
    if (data.some((item) => item.name === newName)) {
      setInputStatus('error')
      setInputErrorMessage(
        `Ya existe una categoría con el nombre "${newName}"`
      )
      return
    }
    sendNewCat()
    setIsModalOpenNewCat(false)
    console.log(`CATEGORIA ${newName} AGREGADA`)
    fetchData()
  }
  const handleCancelNewCat = () => {
    setIsModalOpenNewCat(false)
    console.log('OPERACION CANCELADA')
  }

  return (
    <>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        style={{marginBottom: "15px"}}
        onClick={showModalNewCat}
      >
        Agregar categoría
      </Button>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        locale={{ emptyText: 'No hay categorías disponibles' }}
      />
      <Modal
        title="Editando categoría"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Confirmar"
        afterClose={() => {
          setNewName('')
          setInputStatus('')
        }}
      >
        <p>
          Ingrese un nuevo nombre para la categoría "{data[idSelected].name}"
        </p>
        <Input
          placeholder="Ingrese un nombre"
          onChange={handleChange}
          status={inputStatus}
          value={newName}
        ></Input>
        {inputStatus === 'error' ? (
          <p style={{ color: '#FF4D4F' }}>{inputErrorMessage}</p>
        ) : null}
      </Modal>
      <Modal
        title="Agregando categoría"
        open={isModalOpenNewCat}
        onOk={handleOkNewCat}
        onCancel={handleCancelNewCat}
        cancelText="Cancelar"
        okText="Confirmar"
        afterClose={() => {
          setNewName('')
          setInputStatus('')
        }}
      >
        <p>
          Ingrese un nombre para la nueva categoría
        </p>
        <Input
          placeholder="Ingrese un nombre"
          onChange={handleChange}
          status={inputStatus}
          value={newName}
        ></Input>
        {inputStatus === 'error' ? (
          <p style={{ color: '#FF4D4F' }}>{inputErrorMessage}</p>
        ) : null}
      </Modal>
    </>
  )
}
