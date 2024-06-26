import { fetchPost } from '@Common/helpers'
import { useCustomAlerts } from '@Common/hooks'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ModalForSwapReject({
  open,
  setModalOpen,
  setLoading,
  setExiste,
  thisId
}: {
  open: boolean
  setModalOpen: (x: boolean) => void
  setLoading: (x: boolean) => void
  setExiste: (x: boolean) => void
  thisId: number
}) {

  const miniModal = useCustomAlerts()

  const navigate = useNavigate()

  async function handleOk() {
    setLoading(true)

    const res = await fetchPost("http://localhost:8000/turns/reject/", [{
      id_turn: thisId
    }])
    const result = await res.json()
    if(res.ok){
      miniModal.successNotification("Operación realizada con éxito",result.messages[0])
      setExiste(false)
      navigate("/swaps",{replace: true})
    }
    else{
      miniModal.errorNotification("Operación fallida",result.messages[0]
      )
    }
    setModalOpen(false)
    setLoading(false)

/* 
    console.log('')

    setTimeout(() => setLoading(false), 3000)
    setModalOpen(false)
    console.log('ELIMINANDO SWAP')
    setExiste(false) */
  }

  function handleCancel() {
    setModalOpen(false)
  }

  return (
    <>
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ danger: true }}
        okText="Rechazar"
        okType="primary"
        cancelText="Cancelar"
      >
        <p>¿Está seguro que quiere rechazar este trueque?</p>
      </Modal>
    </>
  )
}
