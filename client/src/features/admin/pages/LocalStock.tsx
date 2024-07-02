import { PageTitle } from '@Common/components'
import {
  Button,
  GetProp,
  InputNumber,
  Modal,
  Space,
  Spin,
  Table,
  Tooltip,
} from 'antd'
import { useEffect, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { useCustomAlerts } from '@Common/hooks'
import { TableProps } from 'antd/lib'

interface SubType {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  cant_current_helpers: number
  active: boolean
}
interface StockType {
  id: number
  categoria: {
    id: number
    name: string
    active: boolean
    score: number
  }
  filial: {
    id: number
    name: string
    x_coordinate: string
    y_coordinate: string
    max_helpers: number
    cant_current_helpers: number
    active: boolean
  }
  cantidad: number
}

interface ErrorType {
  status: '' | 'error' | 'warning'
  msg: string
}

type ColumnsType<T> = TableProps<T>['columns']
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}



export function LocalStock() {

    const parts = window.location.href.split('/')
    const subId: number = parseInt(parts[parts.length - 1])

  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState()
  const [subData, setSubData] = useState<SubType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [stockSelected, setStockSelected] = useState<StockType>()
  const [newStock, setNewStock] = useState<number | null>()
  const [error, setError] = useState<ErrorType>({ status: '', msg: '' })
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

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
  }

  async function fetchSub() {
    setLoading(true)

    const res = await fetch(
      `http://localhost:8000/subsidiary/subsidiary/${subId}/`
    )
    const result = await res.json()
    setSubData(result)

    setLoading(false)
  }

  async function fetchData() {
    setLoading(true)

    const res = await fetch(`http://localhost:8000/stock/retrieve/${subId}`)
    const result = await res.json()
    setNewData(result.data)

    setLoading(false)
  }
  useEffect(() => {
    fetchData()
    fetchSub()
  }, [])

  function handleInputChange(value: number | null) {
    if (value) {
      if (value < 0) {
        setError({ status: 'error', msg: 'Debe ser mayor o igual a 0' })
        setNewStock(value)
        return
      } else {
        setError({ status: '', msg: '' })
        setNewStock(value)
      }
    } else {
      setError({ status: '', msg: '' })
      setNewStock(0)
    }
  }

  const miniModal = useCustomAlerts()

  async function handleOk() {
    setLoading(true)
    setModalOpen(false)
    const res = await fetch(
      `http://localhost:8000/stock/update/${stockSelected?.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cantidad: newStock,
        }),
      }
    )
    const result = await res.json()
    if (result.ok) {
      miniModal.successNotification('Operación exitosa', 'Stock actualizado')
    } else {
      miniModal.errorNotification('Operación fallida', result.messages[0])
    }

    setLoading(false)
    fetchData()
  }

  const columns: ColumnsType<StockType> = [
    {
      title: `Nombre:`,
      dataIndex: 'categoria.name',
      render: (_, record) => `${record.categoria.name}`,
      width: '60%',
    },
    /* {
      title: 'Puntos:',
      dataIndex: 'score',
      render: (_, record) => `${record.categoria.score}`,
    }, */
    {
      title: 'Stock:',
      dataIndex: 'cantidad',
      render: (_, record) => `${record.cantidad}`,
    },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <>
          <Space align="center">
            <Tooltip title="Editar stock">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setModalOpen(true)
                  setStockSelected(record)
                  setNewStock(record.cantidad)
                }}
              ></Button>
            </Tooltip>
          </Space>
        </>
      ),
      width: '100px',
    },
  ]

  return (
    <>
      <PageTitle
        title={subData ? `Stock de la filial ${subData.name}` : ''}
      ></PageTitle>
      <Spin spinning={loading}>
        <Table
          dataSource={newData}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          locale={{ emptyText: 'No hay categorías disponibles' }}
        ></Table>

        <Modal
          title={'Ingrese la cantidad del stock'}
          afterClose={() => {
            setStockSelected(undefined)
            setError({ status: '', msg: '' })
          }}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          cancelText={'Cancelar'}
          okText={'Confirmar'}
          okButtonProps={{ disabled: error.status === 'error' }}
          onOk={handleOk}
        >
          <InputNumber
            status={error.status}
            defaultValue={stockSelected?.cantidad}
            style={{ width: '100%' }}
            /* min={0} */
            value={newStock}
            onChange={handleInputChange}
          ></InputNumber>
          <p style={{ color: '#FF4D4F' }}>{error.msg}</p>
        </Modal>
      </Spin>
    </>
  )
}
