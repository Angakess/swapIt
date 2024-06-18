import { Button, Flex, GetProp, List, Table, Tooltip, Typography } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
/* import { ColumnsType } from 'antd/es/table' */
import { TableProps } from 'antd/lib'
import { MouseEventHandler, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type DataIndex = keyof CategoryType
interface CategoryType {
  id: number
  name: string
  active: boolean
  /* points: number */
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

export function CategoryList({ hasUser }: { hasUser: boolean }) {
  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState<CategoryType[]>()
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  })
  /* const pagination = {
    current: 1,
    pageSize: 5,
  } */
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
      setNewData([])
    }

    // Filtramos los datos según los filtros aplicados
  }

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('http://localhost:8000/category/list/')
    const results = await res.json()
    setNewData(results.data.categories)
    console.log(results)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    console.log('asdasd')
  }, [])

  async function redeemPoints(record: CategoryType) {
    console.log('redimistes ', record.name)
  }

  const columns: ColumnsType<CategoryType> = [
    {
      title: `Nombre`,
      dataIndex: 'name',
      width: '100%',
    },
    {
      title: `Stock`,
      dataIndex: 'stock',
      width: '0',
    },
    {
      title: `Puntos`,
      dataIndex: 'points',
      width: '0',
    },
    {
      title: 'Acciones',
      width: '0',
      render: (_: any, record) => (
        <Flex justify="center">
          <Tooltip title="Canjear puntos">
            <Button
              type="primary"
              disabled={!hasUser}
              icon={<ShoppingOutlined />}
              onClick={() => redeemPoints(record)}
            ></Button>
          </Tooltip>
        </Flex>
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={newData}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={tableParams.pagination}
        locale={{ emptyText: 'No hay categorías disponibles' }}
        onChange={handleTableChange}
        style={{ marginBottom: '2rem' }}
      />
    </>
  )
}
