import { Button, Flex, InputRef, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { Table } from 'antd/lib'
import { useEffect, useRef, useState } from 'react'
import { tableColumnSearchProps } from '@Requests/functions/tableColumnSearchProps'
import { useAuth } from '@Common/hooks'
import { Link } from 'react-router-dom'
import { MiniPostForList } from './MiniPostForList'

type RequestIndex = keyof RequestType
interface RequestType {
  id: number
  myPostName: string
  myPostId: number
  myPostImage: string
  otherPostName: string
  otherPostId: number
  otherPostImage: string
  state: string
  [key: string]: string | number | boolean
}
interface FetchType {
  ok: boolean
  messages: [string]
  data: {
    requests: [
      {
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
        user_maker: number
        user_receive: number
      },
    ]
  }
}

export function TableMyOffers() {
  const [data, setData] = useState<RequestType[]>([])
  const [searchText, setSearchText] = useState({
    myPostName: '',
    otherPostName: '',
    state: '',
  })
  const [loading, setLoading] = useState(false)

  const searchInput = useRef<InputRef>(null)

  const { user } = useAuth()

  function transformData(result: FetchType, newData: RequestType[]) {
    result.data.requests.forEach((element) => {
      newData.push({
        id: element.id,
        myPostName: element.post_maker.name,
        myPostId: element.post_maker.id,
        myPostImage: element.post_maker.image_1,
        otherPostName: element.post_receive.name,
        otherPostId: element.post_receive.id,
        otherPostImage: element.post_receive.image_1,
        state: element.state.charAt(0).toUpperCase() + element.state.slice(1),
      })
    })
  }

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch(
      `http://localhost:8000/requests/my_offerts/${user!.id}`
    )
    const result = await res.json()

    const newData: RequestType[] = []

    transformData(result, newData)

    setData(newData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      title: `Mi publicación: ${searchText.myPostName ? searchText.myPostName : ''}`,
      dataIndex: 'myPostName',
      ...tableColumnSearchProps(
        'myPostName',
        handleSearch,
        handleReset,
        searchInput
      ),
      width: '40%',
      render: (_, record) => (
        <MiniPostForList
          record={{
            postId: record.myPostId,
            postImg: record.myPostImage,
            postName: record.myPostName,
          }}
        ></MiniPostForList>
      ),
    },
    {
      title: `Otra publicación: ${searchText.otherPostName ? searchText.otherPostName : ''}`,
      dataIndex: 'otherPostName',
      ...tableColumnSearchProps(
        'otherPostName',
        handleSearch,
        handleReset,
        searchInput
      ),
      width: '40%',
      render: (_, record) => (
        <MiniPostForList
          record={{
            postId: record.otherPostId,
            postImg: record.otherPostImage,
            postName: record.otherPostName,
          }}
        ></MiniPostForList>
      ),
    },
    {
      title: `Estado:`,
      dataIndex: 'state',
      filters: [
        { text: 'Pendiente', value: 'Pendiente' },
        { text: 'Semi-aceptado', value: 'Semi-aceptado' },
      ],
      onFilter: (value, record) => record.state === value,
      filterSearch: false,
      width: '10%',
    },

    {
      title: 'Acciones',
      width: '0',
      render: (_: any, record) => (
        <Flex justify="center">
          <Link to={`/requests/my-requests/${record.id}`}>
            <Tooltip title="Ver Solicitud">
              <Button type="primary" icon={<InfoCircleOutlined />}></Button>
            </Tooltip>
          </Link>
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
        pagination={false}
        loading={loading}
        locale={{ emptyText: 'No hay solicitudes disponibles' }}
      />
    </>
  )
}
