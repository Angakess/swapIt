import { Modal } from 'antd'

export function ModalForSwapReject({
  open,
  setModalOpen,
  setLoading,
  setExiste,
}: {
  open: boolean
  setModalOpen: (x: boolean) => void
  setLoading: (x: boolean) => void
  setExiste: (x: boolean) => void
}) {
  function handleOk() {
    setLoading(true)

    console.log('')

    setTimeout(() => setLoading(false), 3000)
    setModalOpen(false)
    console.log('ELIMINANDO SWAP')
    setExiste(false)
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
