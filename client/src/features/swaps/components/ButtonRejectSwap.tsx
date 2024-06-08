import { Button } from 'antd'
import { ModalForSwapReject } from './ModalForSwapReject'
import { useState } from 'react'

export function ButtonRejectSwap({
  loading,
  setLoading,
  existe,
  setExiste,
  thisId
}: {
  loading: boolean
  setLoading: (x: boolean) => void
  existe: boolean
  setExiste: (x: boolean) => void
  thisId: number
}) {
  const [modalOpen, setModalOpen] = useState(false)

  function handleClick() {
    setModalOpen(true)
  }
  return (
    <>
      <Button
        type="primary"
        danger
        onClick={handleClick}
        disabled={loading || !existe}
      >
        Rechazar
      </Button>
      <ModalForSwapReject
        open={modalOpen}
        setModalOpen={setModalOpen}
        setLoading={setLoading}
        setExiste={setExiste}
        thisId={thisId}
      ></ModalForSwapReject>
    </>
  )
}
