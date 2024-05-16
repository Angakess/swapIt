import { Checkbox, Flex, Input, InputNumber, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useState } from 'react'

type SubsidiaryType = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number | null
  cant_current_helpers: number
  active: boolean
}
type PropType = {
  subData: SubsidiaryType
  isModalOpen: boolean
  setIsModalOpen: (x: boolean) => void
  subsArray: SubsidiaryType[]
  fetchData: () => void
  setSubSelected: (s:SubsidiaryType | undefined) => void
}
type StatusType = {
  status: '' | 'error'
  errorMessage: string
}

export function ModalEditingSub({
  subData,
  isModalOpen,
  setIsModalOpen,
  subsArray,
  fetchData,
  setSubSelected
}: PropType) {
  const [data, setData] = useState<SubsidiaryType>({
    id: subData.id,
    name: subData.name,
    x_coordinate: subData.x_coordinate,
    y_coordinate: subData.y_coordinate,
    max_helpers: subData.max_helpers,
    cant_current_helpers: subData.cant_current_helpers,
    active: subData.active,
  })
  const [inputStatus, setInputStatus] = useState<StatusType>({
    status: '',
    errorMessage: '',
  })

  const [inputNumberStatus, setInputNumberStatus] = useState<StatusType>({
    status: '',
    errorMessage: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({
      ...prevData,
      name: event.target.value,
    }))
    if (!event.target.value) {
      setInputStatus({
        status: 'error',
        errorMessage: 'El nombre es obligatorio',
      })
      return
    }
    if (
      subsArray.some(
        (item) =>
          item.name === event.target.value &&
          subData.name !== event.target.value
      )
    ) {
      setInputStatus({
        status: 'error',
        errorMessage: `Ya hay una filial con el nombre "${event.target.value}"`,
      })
      return
    }
    setInputStatus({
      status: '',
      errorMessage: '',
    })
  }
  const handleChangeCantHelpers = (value: number | null) => {
    setData((prevData) => ({
      ...prevData,
      max_helpers: value,
    }))
    if (value === null) {
      setInputNumberStatus({
        status: '',
        errorMessage: 'La cantidad de ayudantes es obligatoria',
      })
      return
    }
    if (value <= 0) {
      setInputNumberStatus({
        status: 'error',
        errorMessage: 'La cantidad debe ser mayor a 0',
      })
      return
    }
    if (value < subData.cant_current_helpers) {
      setInputNumberStatus({
        status: 'error',
        errorMessage:
          'El límite de ayudantes no puede ser inferior a la cantidad de ayudantes asignados',
      })
      return
    }
    setInputNumberStatus({
      status: '',
      errorMessage: '',
    })
  }
  const handleCheckboxChange = (event: CheckboxChangeEvent) => {
    setData((prevData) => ({
      ...prevData,
      active: event.target.checked,
    }))
  }

  const handleOk = async () => {
    setIsLoading(true)
    try {
      await fetch(
        `http://localhost:8000/subsidiary/subsidiary/${subData.id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({
            name: data.name,
            max_helpers: data.max_helpers,
            active: data.active,
          }),
        }
      )
      fetchData()
      setIsModalOpen(false)
      setIsLoading(false)
      setSubSelected(data)
    }catch (error) {
      Modal.error({
        title: 'Error',
        content: 'No se encontró la filial seleccionada',
      })
    }
  }
  const handleCancel = () => {
    console.log('CANCEL')
    setIsModalOpen(false)
    
  }

  return (
    <>
      <Modal
        title="Editando una filial"
        afterOpenChange={() => setData(subData)}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Aplicar cambios"
        okButtonProps={{
          disabled:
            data.name === '' ||
            inputStatus.status === 'error' ||
            inputNumberStatus.status === 'error' ||
            isLoading
        }}
      >
        <Flex vertical gap="25px">
          <label>
            Nombre:
            <Input
              value={data.name}
              onChange={(event) => handleChangeName(event)}
            ></Input>
            {inputStatus.status ? (
              <p style={{ color: '#FF4D4F' }}>{inputStatus.errorMessage}</p>
            ) : null}
          </label>
          <label>
            Cantidad máxima de ayudantes: <br />
            <InputNumber
              value={data.max_helpers}
              onChange={(value) => handleChangeCantHelpers(value)}
            ></InputNumber>
            {inputNumberStatus.status ? (
              <p style={{ color: '#FF4D4F' }}>
                {inputNumberStatus.errorMessage}
              </p>
            ) : null}
          </label>
          {!subData.active ?
            <>
              <Checkbox defaultChecked={false} disabled={data.cant_current_helpers <= 0} onChange={handleCheckboxChange}>Activa</Checkbox>
              {data.cant_current_helpers <= 0 ? 
                <p>No se puede activar una filial sin ayudantes</p> : null}
            </> : null}
            
          
        </Flex>
      </Modal>
    </>
  )
}
