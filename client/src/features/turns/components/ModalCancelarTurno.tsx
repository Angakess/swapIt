import { Modal } from "antd"

export function ModalCancelarTurno({
    turnEstate,
    loading,
    setLoading,
    modalOpen,
    setModalOpen,
  }: {
    turnEstate: boolean | undefined
    loading: boolean
    setLoading: (x:boolean) => void
    modalOpen: boolean
    setModalOpen: (x:boolean) => void
  }) {
    async function handleOk() {
      setLoading(true)
      console.log('Se cancelo el turno con ', turnEstate)
      setLoading(false)
      setModalOpen(false)
    }
    function handleCancel() {
      setLoading(true)
      console.log('Se cancelo la cancelacion del turno ', turnEstate)
      setLoading(false)
      setModalOpen(false)
    }

    return (
      <>
        <Modal
          title="Atención"
          open={modalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText="Cerrar"
          okText="Confirmar"
          cancelButtonProps={{ disabled: loading }}
          okButtonProps={{ danger: true, disabled: loading }}
        >
          <p>¿Está seguro que quiere cancelar este turno?</p>
          {!turnEstate ? (
            <p style={{ fontWeight: 'bold' }}>
              IMPORTANTE: Si cancela un turno previamente confirmado recibirá
              una penalización
            </p>
          ) : null}
        </Modal>
      </>
    )
  }