import { App, Modal } from 'antd'
import { useState } from 'react'

type AddPostModal = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddPostModal({ isOpen, setIsOpen }: AddPostModal) {
  const { notification } = App.useApp()
  const [confirmLoading, setConfirmLoading] = useState(false)

  function handleOk() {
    setConfirmLoading(true)
    setTimeout(() => {
      setIsOpen(false)
      setConfirmLoading(false)
      notification.success({
        message: 'Publicación agregada correctamente',
        description: 'Se ha agregado la publicación',
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
    }, 2000)
  }

  return (
    <Modal
      title="Agregar publicación"
      open={isOpen}
      onOk={handleOk}
      onCancel={() => setIsOpen(false)}
      confirmLoading={confirmLoading}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus placeat
      adipisci fuga doloremque praesentium esse impedit magnam! Est error
      repellendus, quibusdam tenetur maxime ea, eligendi quia culpa
      necessitatibus inventore sapiente.
    </Modal>
  )
}
