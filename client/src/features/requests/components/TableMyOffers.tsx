import {
  Button,
  Flex,
  GetProp,
  InputRef,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { Table } from 'antd/lib'
import { useEffect, useRef, useState } from 'react'
import { tableColumnSearchProps } from '@Requests/functions/tableColumnSearchProps'

type RequestIndex = keyof RequestType
interface RequestType {
  id: number

  [key: string]: string | number | boolean
}
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function TableMyOffers() {
  const [data, setData] = useState<RequestType[]>([])
  const [searchText, setSearchText] = useState({
    id: 0,
  })
  const [loading, setLoading] = useState(false)

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const searchInput = useRef<InputRef>(null)

  const fetchData = async() => {
    setLoading(true)
    const res = await fetch('http://localhost:8000/users/list-exchangers/')
    const result = await res.json()
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

    const filteredData = data.filter((item: RequestType) =>
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
    RequestIndex: RequestIndex
  ) => {
    confirm(),
      setSearchText((prevText) => {
        return {
          ...prevText,
          [RequestIndex]: selectedKeys[0],
        }
      })
  }

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps['confirm'],
    RequestIndex: RequestIndex
  ) => {
    clearFilters()
    setSearchText((searchText) => {
      return {
        ...searchText,
        [RequestIndex]: '',
      }
    })
    confirm()
  }

  const columns: ColumnsType<RequestType> = [
    {
      title: `ID: ${searchText.id ? searchText.id : ''}`,
      dataIndex: 'code',
      ...tableColumnSearchProps('id', handleSearch, handleReset, searchInput),
      width: '30%',
    },
    {
      title: 'Acciones',
      width: '0',
      render: (_: any, record) => (
        <Flex justify="center">
          <Button></Button>
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
        locale={{ emptyText: 'No hay trueques pendientes para el día de hoy' }}
      />
    </>
  )
}
