import { Flex, GetProp, InputRef, Table } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import {
  FilterDropdownProps,
  TablePaginationConfig,
} from 'antd/es/table/interface'

import MOCK_TURNS from '../MOCK_TURNS.json'
import { ButtonVerTurno } from '@Turns/components/ButtonVerTurno'
import { tableColumnSearchProps } from '@Turns/functions/tableColumnSearchProps'
import dayjs from 'dayjs'
import { MiniPostForTable, PageTitle } from '@Common/components'
import { useAuth } from '@Common/hooks'

type DataIndex = keyof DataType
interface DataType {
  id: number
  date: string
  subsidiary: string
  myPostId: number
  myPostName: string
  myPostImage: string
  otherPostId: number
  otherPostName: string
  otherPostImage: string
  [key: string]: string | number | boolean
}
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}
interface FetchType {
  id: number
  post_maker: {
    id: number
    name: string
    description: string
    value: number
    user: {
      id: number
      first_name: string
      last_name: string
      dni: string
      email: string
      role: string
      state: {
        name: string
      }
    }
    subsidiary: {
      id: number
      name: string
      x_coordinate: string
      y_coordinate: string
      max_helpers: number
      cant_current_helpers: number
      active: boolean
    }
    state: {
      id: number
      name: string
    }
    category: string
    state_product: string
    stock_product: number
    image_1: string
    image_2: string | null
    image_3: string | null
    image_4: string | null
    image_5: string | null
  }
  post_receive: {
    id: number
    name: string
    description: string
    value: number
    user: {
      id: number
      first_name: string
      last_name: string
      dni: string
      email: string
    }
    subsidiary: {
      name: string
      x_coordinate: string
      y_coordinate: string
    }
    category: string
    state_product: string
    image_1: string
    image_2: string | null
    image_3: string | null
    image_4: string | null
    image_5: string | null
  }
  day_of_request: string
}

export function MyTurns() {
  const { user } = useAuth()
  const [data, setData] = useState<DataType[]>([])
  const [searchText, setSearchText] = useState({
    id: 0,
    date: '',
    subsidiary: '',
    myPostName: '',
    otherPostName: '',
  })
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const searchInput = useRef<InputRef>(null)

  function transformData(result: FetchType): DataType {
    const aux = {
      myPostId: 0,
      myPostName: '',
      myPostImage: '',
      otherPostId: 0,
      otherPostName: '',
      otherPostImage: '',
    }

    if (user?.id === result.post_maker.user.id) {
      aux.myPostId = result.post_maker.id
      aux.myPostName = result.post_maker.name
      aux.myPostImage = result.post_maker.image_1
      aux.otherPostId = result.post_receive.id
      aux.otherPostName = result.post_receive.name
      aux.otherPostImage = result.post_receive.image_1
    } else {
      aux.myPostId = result.post_receive.id
      aux.myPostName = result.post_receive.name
      aux.myPostImage = result.post_maker.image_1
      aux.otherPostId = result.post_maker.id
      aux.otherPostName = result.post_maker.name
      aux.otherPostImage = result.post_receive.image_1
    }

    return {
      id: result.id,
      date: result.day_of_request, //Viene con formato "YYYY-MM-DD",
      subsidiary: result.post_receive.subsidiary.name,
      myPostId: aux.myPostId,
      myPostName: aux.myPostName,
      myPostImage: aux.myPostImage,
      otherPostId: aux.otherPostId,
      otherPostName: aux.myPostName,
      otherPostImage: aux.otherPostImage,
    }
  }

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch(`http://localhost:8000/turns/my_turns/${user?.id}`)

    const result = await res.json()
    const newData: DataType[] = []
    result.forEach((element: FetchType) => {
      const newElement: DataType = transformData(element)
      newData.push(newElement)
    })
    setData(newData)

    /* const result = MOCK_TURNS
    setData(result) */

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
    /* {
      title: `Fecha: ${searchText.date ? searchText.date : ''}`,
      dataIndex: 'date',
      render: (date) => {
        const parts = date.split('-')
        return `${parts[2]}/${parts[1]}/${parts[0]}`
      },
      ...tableColumnSearchProps('date', handleSearch, handleReset, searchInput),
      width: '15%',
      sorter: (a, b) => {
        const dateA = dayjs(a.date, 'YYYY-MM-DD')
        const dateB = dayjs(b.date, 'YYYY-MM-DD')
        if (dateA.isBefore(dateA)) {
          return -1
        }
        if (dateA.isAfter(dateB)) {
          return 1
        }
        return 0
      },
      defaultSortOrder: 'ascend',
    }, */
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
      width: '25%',
    },
    {
      title: `Mi publicación: ${searchText.myPostName}`,
      dataIndex: 'myPostName',
      render: (myPostName, record) => (
        <MiniPostForTable
          record={{
            postId: record.myPostId,
            postImg: record.myPostImage,
            postName: myPostName,
          }}
        ></MiniPostForTable>
      ),
      ...tableColumnSearchProps(
        'myPostName',
        handleSearch,
        handleReset,
        searchInput
      ),
      width: '25%',
    },
    {
      title: `Otra publicación: ${searchText.otherPostName}`,
      dataIndex: 'otherPostName',
      render: (otherPostName, record) => (
        <MiniPostForTable
          record={{
            postId: record.otherPostId,
            postImg: record.otherPostImage,
            postName: otherPostName,
          }}
        ></MiniPostForTable>
      ),
      ...tableColumnSearchProps(
        'otherPostName',
        handleSearch,
        handleReset,
        searchInput
      ),
      width: '25%',
    },
    {
      title: 'Acciones',
      render: (_: any, record: DataType) => (
        <Flex justify="center">
          <ButtonVerTurno turnId={record.id}></ButtonVerTurno>
        </Flex>
      ),
      width: '0',
    },
  ]

  return (
    <>
      <PageTitle title="Mis turnos" />
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
