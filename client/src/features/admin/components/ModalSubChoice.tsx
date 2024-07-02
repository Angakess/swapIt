import { useCustomAlerts } from '@Common/hooks'
import { Modal } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { Select } from 'antd/lib'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SubType = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  cant_current_helpers: number
  active: boolean
}

export function ModalSubChoice({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  userId,
  setExists,
}: {
  openModal: boolean
  setOpenModal: (x: boolean) => void
  loading: boolean
  setLoading: (x: boolean) => void
  userId: number
  setExists: (x: boolean) => void
}) {

    const navigate = useNavigate()

  const [subs, setSubs] = useState<SubType[]>([])
  const [subSelected, setSubSelected] = useState<number>()

  function handleCancel() {
    setOpenModal(false)
  }

  const miniModal = useCustomAlerts()
  async function handleOk() {
    setOpenModal(false)
    setLoading(true)
    const res = await fetch(
      `http://localhost:8000/users/convert-to-helper/${userId}/${subSelected}`
    )
    const result = await res.json()
    
    if (result.ok) {
      miniModal.successNotification('Operación exitosa', result.messages[0])
      navigate("/admin/exchangers",{replace: true})
    } else {
      miniModal.errorNotification('Operación fallida', result.messages[0])
    }
    
    setLoading(false)
    
    setExists(false)
  }

  async function fetchSubs() {
    /* setLoading(true) */
    const res = await fetch('http://localhost:8000/subsidiary/subsidiaries/')
    const result = await res.json()
    const resultFiltered = result.filter(
      (e: SubType) => e.max_helpers - e.cant_current_helpers >= 1
    )
    setSubs(resultFiltered)
    /* setLoading(false) */
  }
  useEffect(() => {
    fetchSubs()
  }, [])

  function makeOptions() {
    const options: DefaultOptionType[] = []
    for (let index = 0; index < subs!.length; index++) {
      const element = subs![index]
      options.push({ value: element.id, label: element.name })
    }
    return options
  }

  function handleSelectChange(value: number) {
    setSubSelected(value)
  }

  return (
    <>
      <Modal
        title="Seleccione una filial"
        open={openModal}
        onCancel={handleCancel}
        onOk={handleOk}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: loading || !subSelected }}
        cancelButtonProps={{ disabled: loading }}
      >
        {subs.length >= 1 ? (
          <Select
            options={makeOptions()}
            onChange={handleSelectChange}
            style={{ width: '100%' }}
          ></Select>
        ) : (
          <p>No hay filiales disponibles</p>
        )}
      </Modal>
    </>
  )
}
