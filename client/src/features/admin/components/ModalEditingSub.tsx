import { Checkbox, Input, InputNumber, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useState } from 'react'

type DataType = {
    id: number
    name: string
    max_helpers: number | null
    active: boolean
}
type SubsidiaryType = {
    id: number,
    name: string,
    x_coordinate: string,
    y_coordinate: string,
    max_helpers: number,
    active: boolean
}
type PropType = {
    subData: SubsidiaryType
    isModalOpen: boolean
    setIsModalOpen: (x:boolean) => void
}

export function ModalEditingSub({subData, isModalOpen, setIsModalOpen}: PropType) {
  
    const [data, setData] = useState<DataType>({
        id: subData.id,
        name: subData.name,
        max_helpers: subData.max_helpers,
        active: subData.active
    })



    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(prevData => ({
            ...prevData,
            name: event.target.value
        }))
    }
    const handleChangeCantHelpers = (value: number | null) => {
        setData(prevData => ({
            ...prevData,
            max_helpers: value
        }))
    }
    const handleChangeActive = (event: CheckboxChangeEvent) => {
        setData(prevData => ({
            ...prevData,
            active: event.target.checked
        }))
    }

    const handleOk = () => {
        console.log("OK", data)
    }
    const handleCancel = () => {
        console.log("CANCEL")
        setIsModalOpen(false)
    }

    return (
    <>
      <Modal
        title="Editando una filial"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Aplicar cambios"
      >
        <label>Nombre: 
            <Input value={data.name} onChange={(event) => handleChangeName(event)}></Input>
        </label>
        <label>Cantidad máxima de ayudantes:
            <InputNumber value={data.max_helpers} onChange={(value) => handleChangeCantHelpers(value)}></InputNumber>
        </label>
        <label>Activa
            <Checkbox checked={data.active} onChange={(event) => handleChangeActive(event)}></Checkbox>
        </label>
      </Modal>
    </>
  )
}
