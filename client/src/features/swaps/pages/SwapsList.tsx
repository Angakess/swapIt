import { Button, Flex, GetProp, InputRef, Space, Table } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import {
  FilterDropdownProps,
  TablePaginationConfig,
} from 'antd/es/table/interface'
import { tableColumnSearchProps } from '@Swaps/functions/tableColumnSearchProps'
import { ButtonVerSwap } from "@Swaps/components/ButtonVerSwap"

import MOCK_SWAPS_TODAY from '@Swaps/MOCK_SWAPS_TODAY.json'

type SwapIndex = keyof SwapType
interface SwapType {
  id: number
  code: string
  dniA: string
  dniB: string
  [key: string]: string | number | boolean
}
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function SwapsList() {
  const [data, setData] = useState<SwapType[]>([])
  const [searchText, setSearchText] = useState({
    id: 0,
    code: '',
    dni: '',
  })
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [turnSelected, setTurnSelected] = useState<SwapType>()
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
    const result = MOCK_SWAPS_TODAY
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

    const filteredData = data.filter((item: SwapType) =>
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
    SwapIndex: SwapIndex
  ) => {
    confirm(),
      setSearchText((prevText) => {
        return {
          ...prevText,
          [SwapIndex]: selectedKeys[0],
        }
      })
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    SwapIndex: SwapIndex
  ) => {
    clearFilters()
    setSearchText((searchText) => {
      return {
        ...searchText,
        [SwapIndex]: '',
      }
    })
    confirm()
  }

  const columns: ColumnsType<SwapType> = [
    {
      title: `Code: ${searchText.code ? searchText.code : ''}`,
      dataIndex: 'code',
      ...tableColumnSearchProps('code', handleSearch, handleReset, searchInput),
    },
    {
      title: `DNIs: ${searchText.dni ? searchText.dni : ''}`,
      render: (_: any, record: SwapType) => (
        <>
          <ul>
            <li>{record.dniA}</li>
            <li>{record.dniB}</li>
          </ul>
        </>
      ),
      ...tableColumnSearchProps('dni', handleSearch, handleReset, searchInput),
      onFilter: (value, record) =>
        record.dniA
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()) ||
        record.dniB
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: 'Acciones',
      width: '0',
      render: (_: any, record: SwapType) => (
        <Flex justify="center">
          <ButtonVerSwap swapId={record.id}></ButtonVerSwap>
        </Flex>
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
    </>
  )
}
