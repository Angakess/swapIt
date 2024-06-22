import { Button, Flex, GetProp, Table, Tooltip } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
/* import { ColumnsType } from 'antd/es/table' */
import { TableProps } from 'antd/lib'
import { useEffect, useState } from 'react'

/* type DataIndex = keyof CategoryType */
interface CategoryType {
  id: number
  name: string
  active: boolean
  /* points: number */
  [key: string]: string | number | boolean
}

interface RootObject {
  id: number
  categoria: Categoria
  filial: Filial
  cantidad: number
}

interface Filial {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  cant_current_helpers: number
  active: boolean
}

interface Categoria {
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

export function CategoryList({ hasUser }: { hasUser: boolean }) {
  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState<RootObject[]>()
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
    // const res = await fetch('http://localhost:8000/category/list/')
    fetch('http://localhost:8000/stock/retrieve/1')
      .then(res => res.json())
      .then(results =>results.data)
      .then(data => data.filter((result: RootObject) => result.categoria.active))
      .then(filtered =>
        filtered.map((result: RootObject) => ({
          id: result.id,
          name: result.categoria.name,
          stock: result.cantidad,
          points: 10,
        }))
      )
      .then(finalData => {
        setNewData(finalData)
        setLoading(false)
      })
      .catch((error) => {
        console.log('[ERROR][FETCH][GET STOCK FILIAL]\n', error)
        setLoading(false)
      })
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
