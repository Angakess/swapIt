import {
  App,
  Button,
  GetProp,
  Input,
  InputNumber,
  InputRef,
  Modal,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tooltip,
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
import { fetchPost } from '@Common/helpers'
import { PageTitle } from '@Common/components'
/* import MOCK_DATA from "./MOCK_DATA_CAT.json" */

type DataIndex = keyof DataType
interface DataType {
  id: number
  name: string
  active: boolean
  score: number
  [key: string]: string | number | boolean
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
  const [data, setData] = useState<DataType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [searchCatName, setSearchCatName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [catSelected, setCatSelected] = useState<DataType>({
    id: -1,
    name: '',
    active: false,
    score: 0
  })
  const [newName, setNewName] = useState('')
  const [newScore, setNewScore] = useState<number | null>()
  const [inputStatus, setInputStatus] = useState<'' | 'error'>('')
  const [inputErrorMessage, setInputErrorMessage] = useState('')
  const { modal } = App.useApp()

  const searchInput = useRef<InputRef>(null)

  const handleTableChange: TableProps['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    // Seteamos los parámetros de la tabla
    setTableParams({
      pagination,
      filters,
      ...sorter,
    })

    // Verificamos si el tamaño de la página ha cambiado para reiniciar los datos
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([])
    }

    // Filtramos los datos según los filtros aplicados
    const filteredData = data.filter((item: DataType) =>
      Object.keys(filters).every((key: string) => {
        if (filters[key]?.length === 0) return true
        return filters[key]?.includes(item[key])
      })
    )

    // Actualizamos el total de elementos en la paginación
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
        total: filteredData.length,
      },
    })
  }

  const fetchData = async () => {
    setIsLoading(true)
    const res = await fetch('http://localhost:8000/category/list/')
    const results = await res.json()
    setData(results.data.categories)
    console.log(results)
    setIsLoading(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
      },
    })
  }
  const sendNewCat = () => {
    setIsLoading(true)
    fetchPost('http://localhost:8000/category/create', {
      name: newName,
    })
    setIsLoading(true)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    searchCatName,
  ])

  /* const handleTableChange: TableProps['onChange'] = (
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
  } */

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

  const handleClickPause = async (id: number) => {
    setIsLoading(true)
    const res = await fetch('http://localhost:8000/category/remove', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({
        pk: id,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      modal.success({
        title: 'Operación completada',
        content: data.messages[0],
      })
    } else {
      modal.error({
        title: 'Operación fallida',
        content: data.messages[0],
      })
    }
    setIsLoading(false)
    fetchData()
  }
  const handleClickResume = async (id: number) => {
    setIsLoading(true)
    const res = await fetch('http://localhost:8000/category/restore', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        pk: id,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      modal.success({
        title: 'Operación completada',
        content: data.messages[0],
      })
    } else {
      modal.error({
        title: 'Operación fallida',
        content: data.messages[0],
      })
    }
    setIsLoading(false)
    fetchData()
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
      title: `Nombre: ${searchCatName ? searchCatName : ''}`,
      dataIndex: 'name',
      render: (name) => `${name}`,
      width: '60%',
      ...getColumnSearchProps('name'),
    },
    {
      title: "Puntos:",
      dataIndex: "score",
      render: (score) => `${score}`,

    },
    {
      title: `Estado:`,
      dataIndex: 'active',
      render: (isActive) => (isActive ? 'Activo' : 'Pausado'),
      filters: [
        { text: 'Activo', value: true },
        { text: 'Pausado', value: false },
      ],
      onFilter: (value, record) => record.active === value,
      filterSearch: false,
    },
    {
      title: 'Acciones',
      render: (_: any, record: DataType) => (
        <Space>
          {record.active ? (
            <Button
              type="default"
              icon={<PauseOutlined />}
              onClick={() => handleClickPause(record.id)}
            ></Button>
          ) : (
            <Button
              type="default"
              icon={<CaretRightOutlined />}
              onClick={() => handleClickResume(record.id)}
            ></Button>
          )}
          <Tooltip title="Editar categoría">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showModalEdit(record)}
            ></Button>
          </Tooltip>
        </Space>
      ),
      width: '100px',
    },
  ]

  const sendCatNameChange = async (id: number) => {
    setIsLoading(true)
    const res = await fetch(`http://localhost:8000/category/update/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        name: newName,
        score: newScore
      }),
    })
    if (!res.ok) {
      modal.error({
        title: 'Operación fallida',
      })
    }
    setIsLoading(false)
    fetchData()
  }

  const showModalEdit = (record: DataType) => {
    setIsModalOpen(true)
    setCatSelected(record)
    setNewScore(record.score)
    setNewName(record.name)
  }
  const handleOk = () => {
    if (!newName) {
      setInputStatus('error')
      setInputErrorMessage('El nombre es obligatorio')
      return
    }
    /* if (data?.some((item) => item.name === newName)) {
      setInputStatus('error')
      setInputErrorMessage(`Ya existe una categoría con el nombre "${newName}"`)
      return
    } */
    sendCatNameChange(catSelected.id)
    setIsModalOpen(false)
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
    if (data?.some((item) => item.name === newName)) {
      setInputStatus('error')
      setInputErrorMessage(`Ya existe una categoría con el nombre "${newName}"`)
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
  function handleChangeScore(value: number | null){
    setNewScore(value)
  }

  return (
    <>
      <PageTitle
        title="Categorías"
        right={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: '15px' }}
            onClick={showModalNewCat}
          >
            Agregar
          </Button>
        }
      />
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
          setNewScore(catSelected.score)
          setInputStatus('')
        }}
      >
        <p>Ingrese un nuevo nombre para la categoría "{catSelected.name}"</p>
        <Input
          placeholder="Ingrese un nombre"
          onChange={handleChange}
          status={inputStatus}
          value={newName}
          onPressEnter={handleOk}
        ></Input>
        {inputStatus === 'error' ? (
          <p style={{ color: '#FF4D4F' }}>{inputErrorMessage}</p>
        ) : null}
        <p>Ingrese un puntaje</p>
        <InputNumber defaultValue={catSelected.score} value={newScore} min={1} onChange={(v) => handleChangeScore(v)}></InputNumber>
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
        <p>Ingrese un nombre para la nueva categoría</p>
        <Input
          placeholder="Ingrese un nombre"
          onChange={handleChange}
          status={inputStatus}
          value={newName}
          onPressEnter={handleOkNewCat}
        ></Input>
        {inputStatus === 'error' ? (
          <p style={{ color: '#FF4D4F' }}>{inputErrorMessage}</p>
        ) : null}
      </Modal>
    </>
  )
}
