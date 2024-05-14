import { Checkbox, Flex, Input, InputNumber, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useState } from 'react'

type DataType = {
  id: number
  name: string
  max_helpers: number | null
  active: boolean
}
type SubsidiaryType = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  active: boolean
}
type PropType = {
  subData: SubsidiaryType
  isModalOpen: boolean
  setIsModalOpen: (x: boolean) => void
  subsArray: SubsidiaryType[]
  fetchData: () => void
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
}: PropType) {
  const [data, setData] = useState<DataType>({
    id: subData.id,
    name: subData.name,
    max_helpers: subData.max_helpers,
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
    if (value < 5 /* subData.current_helpers */) {
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
  const handleChangeActive = (event: CheckboxChangeEvent) => {
    setData((prevData) => ({
      ...prevData,
      active: event.target.checked,
    }))
  }

  const handleOk = async () => {
    console.log('OK', data)
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
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'No se encontró la filial seleccionada',
      })
    }
    fetchData()
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    console.log('CANCEL')
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
        okButtonProps={{
          disabled:
            data.name === '' ||
            inputStatus.status === 'error' ||
            inputNumberStatus.status === 'error',
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
          <Checkbox
            checked={data.active}
            onChange={(event) => handleChangeActive(event)}
            disabled={5 > 0}
          >
            Activa 
          </Checkbox>
          {5 > 0 ? <p style={{opacity: "75%"}}>{"("}Para desactivar una filial no debe haber ningún ayudante asignado{")"}</p> : null}

        </Flex>
      </Modal>
    </>
  )
}
