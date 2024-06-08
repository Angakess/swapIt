import { Flex, GetProp, InputRef, Table } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import {
  FilterDropdownProps,
  TablePaginationConfig,
} from 'antd/es/table/interface'
import { tableColumnSearchProps } from '@Swaps/functions/tableColumnSearchProps'
import { ButtonVerSwap } from '@Swaps/components/ButtonVerSwap'

import MOCK_SWAPS_TODAY from '@Swaps/MOCK_SWAPS_TODAY.json'
import { fetchPost } from '@Common/helpers'
import { useAuth } from '@Common/hooks'
import dayjs from 'dayjs'

type SwapIndex = keyof SwapType
interface SwapType {
  id: number
  dniA: string
  nameA: string
  dniB: string
  nameB: string
  [key: string]: string | number | boolean
}
interface FetchType {
  id: number
  subsidiary: {
    id: number
    name: string
    x_coordinate: string
    y_coordinate: string
    max_helpers: number
    cant_current_helpers: number
    active: boolean
  }
  user_maker: {
    first_name: string
    last_name: string
    dni: string
    email: string
    gender: string
    date_of_birth: string
    phone_number: string
    password: string
    role: string
    id_subsidiary: number | null
    rating: number
  }
  user_received: {
    first_name: string
    last_name: string
    dni: string
    email: string
    gender: string
    date_of_birth: string
    phone_number: string
    password: string
    role: string
    id_subsidiary: number | null
    rating: number
  }
  request: {
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
    state: string
    rejected: number
    day_of_request: string
    user_maker: number
    user_receive: number
  }
  code_maker: string
  code_received: string
  state: number
}
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function SwapsList() {

  const {user} = useAuth()

  const [data, setData] = useState<SwapType[]>([])
  const [searchText, setSearchText] = useState({
    id: 0,
    code: '',
    dni: '',
  })
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const searchInput = useRef<InputRef>(null)

  function transformData(element: FetchType): SwapType {
    return {
      id: element.id,
      dniA: element.user_maker.dni,
      nameA: element.user_maker.first_name + ' ' + element.user_maker.last_name,
      dniB: element.user_received.dni,
      nameB: element.user_received.first_name + ' ' + element.user_received.last_name,
    }
  }

  const fetchData = async () => {
    setLoading(true)

    const res = await fetchPost(`http://localhost:8000/turns/list_today/`,{
      date: dayjs().format("YYYY-MM-DD"),
      id_helper:  user?.id
    })
    const result = await res.json()
    const newData: SwapType[] = []
    result.forEach((element: FetchType) => {
      if(element.state == 1){
const newElement: SwapType = transformData(element)
      newData.push(newElement)
      }
      
    })
    setData(newData)
    console.log(result)
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
      title: `DNI Ofrecedor: ${searchText.code ? searchText.code : ''}`,
      dataIndex: 'dniA',
      ...tableColumnSearchProps('dniA', handleSearch, handleReset, searchInput),
      
    },
    {
      title: `Nombre Ofrecedor: ${searchText.code ? searchText.code : ''}`,
      dataIndex: 'nameA',
      ...tableColumnSearchProps(
        'nameA',
        handleSearch,
        handleReset,
        searchInput
      ),
      
    },
    {
      title: `DNI Ofrecido: ${searchText.code ? searchText.code : ''}`,
      dataIndex: 'dniB',
      ...tableColumnSearchProps('dniB', handleSearch, handleReset, searchInput),
      
    },
    {
      title: `Nombre Ofrecido: ${searchText.code ? searchText.code : ''}`,
      dataIndex: 'nameB',
      ...tableColumnSearchProps(
        'nameB',
        handleSearch,
        handleReset,
        searchInput
      ),
      
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
        locale={{ emptyText: 'No hay trueques pendientes para el día de hoy' }}
      />
    </>
  )
}
