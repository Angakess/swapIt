import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface DataType {
  id: number
  date: string
  subsidiary: string
  confirmed: boolean
  [key: string]: string | number | boolean
}

export function ButtonCancelarTurno({
  record,
  setModalOpen,
  setTurnSelected,
}: {
  record: DataType
  setModalOpen: (x: boolean) => void
  setTurnSelected: (r: DataType) => void
}) {
  function handleClick(record: DataType) {
    setModalOpen(true)
    setTurnSelected(record)
  }

  return (
    <>
    <Tooltip title="Cancelar turno">
        <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleClick(record)}
        ></Button>
    </Tooltip>
      
    </>
  )
}
