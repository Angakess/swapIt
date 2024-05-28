import { GetProp, InputRef, Space, Table } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import {
  FilterDropdownProps,
  TablePaginationConfig,
} from 'antd/es/table/interface'

import MOCK_TURNS from '../MOCK_TURNS.json'
import { ButtonCancelarTurno } from '@Turns/components/ButtonCancelarTurno'
import { ButtonVerTurno } from '@Turns/components/ButtonVerTurno'
import { ModalCancelarTurno } from '@Turns/components/ModalCancelarTurno'
import { tableColumnSearchProps } from '@Turns/functions/tableColumnSearchProps'

type DataIndex = keyof DataType
interface DataType {
  id: number
  date: string
  subsidiary: string
  confirmed: boolean
  [key: string]: string | number | boolean
}
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function MyTurns() {
  const [data, setData] = useState<DataType[]>([])
  const [searchText, setSearchText] = useState<DataType>({
    id: 0,
    date: '',
    subsidiary: '',
    confirmed: false,
  })
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [turnSelected, setTurnSelected] = useState<DataType>()
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const searchInput = useRef<InputRef>(null)

  const fetchData = () => {
    setLoading(true)
    /* const res = await fetch('http://localhost:8000/users/list-exchangers/')
    const result = await res.json() */
    const result = MOCK_TURNS
    setData(result)
    setLoading(false)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
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

    const filteredData = data.filter((item: DataType) =>
      Object.keys(filters).every((key: string) => {
        if (filters[key]?.length === 0) return true
        return filters[key]?.includes(item[key])
      })
    )

    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
        total: filteredData.length,
      },
    })
  }

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
  }

  const columns: ColumnsType<DataType> = [
    {
      title: `ID: ${searchText.id ? searchText.id : ''}`,
      dataIndex: 'id',
      render: (id) => `${id}`,
      ...tableColumnSearchProps('id', handleSearch, handleReset, searchInput),
    },
    {
      title: `Fecha: ${searchText.date ? searchText.date : ''}`,
      dataIndex: 'date',
      render: (date) => `${date}`,
      ...tableColumnSearchProps('date', handleSearch, handleReset, searchInput),

      //arreglar cuando este conectado al backend
      sorter: (a, b) => a.date.localeCompare(b.date),
      defaultSortOrder: 'ascend',
    },
    {
      title: `Filial: ${searchText.subsidiary}`,
      dataIndex: 'subsidiary',
      render: (sub) => `${sub}`,
      ...tableColumnSearchProps(
        'subsidiary',
        handleSearch,
        handleReset,
        searchInput
      ),
      sorter: (a, b) => a.subsidiary.localeCompare(b.subsidiary),
    },
    {
      title: `Estado:`,
      dataIndex: 'confirmed',
      render: (confirmed) => (confirmed ? 'Confirmado' : 'Sin confirmar'),
      filters: [
        { text: 'Confirmado', value: true },
        { text: 'Sin confirmar', value: false },
      ],
      onFilter: (value, record) => record.confirmed === value,
      filterSearch: false,
    },
    {
      title: 'Acciones',
      render: (_: any, record: DataType) => (
        <Space>
          <ButtonVerTurno turnId={record.id}></ButtonVerTurno>
          <ButtonCancelarTurno
            record={record}
            setModalOpen={setModalOpen}
            setTurnSelected={setTurnSelected}
          ></ButtonCancelarTurno>
        </Space>
      ),
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
        locale={{ emptyText: 'No hay turnos disponibles' }}
      />
      <ModalCancelarTurno
        turnEstate={turnSelected?.confirmed}
        loading={loading}
        setLoading={setLoading}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      ></ModalCancelarTurno>
    </>
  )
}
